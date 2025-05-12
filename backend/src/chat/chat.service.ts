import { Injectable, NotFoundException, UnauthorizedException, Logger, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from './entities/chat_participant.entity';
import { CreateChatRequest } from '../common/DTO/CreateChatRequest';
import { UpdateChatParticipantsRequest } from '../common/DTO/UpdateChatParticipantsRequest';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/Enum/Role';
import { Message } from './entities/message.entity';
import { CreateMessageRequest } from '../common/DTO/CreateMessageRequest';
import { In } from 'typeorm';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatParticipant)
    private chatParticipantRepository: Repository<ChatParticipant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createChat(createChatRequest: CreateChatRequest, userId: string): Promise<Chat> {
    this.logger.log('Creating chat with data:', createChatRequest);

    try {
      // Создаем чат
      const chat = this.chatRepository.create({
        name: createChatRequest.name,
        chatType: createChatRequest.chatType,
        createdById: userId
      });
      this.logger.log('Created chat entity:', chat);
      
      await this.chatRepository.save(chat);
      this.logger.log('Saved chat to database');

      // Добавляем участников
      for (const participant of createChatRequest.participants) {
        this.logger.log('Processing participant:', participant);
        
        const user = await this.userRepository.findOne({ where: { id: participant.userId } });
        if (!user) {
          this.logger.error(`User with ID ${participant.userId} not found`);
          throw new NotFoundException(`User with ID ${participant.userId} not found`);
        }
        this.logger.log('Found user:', user);

        const chatParticipant = this.chatParticipantRepository.create({
          chat,
          user,
          role: participant.role,
        });
        this.logger.log('Created chat participant:', chatParticipant);
        
        await this.chatParticipantRepository.save(chatParticipant);
        this.logger.log('Saved chat participant to database');
      }

      // Загружаем чат со всеми связями
      const savedChat = await this.chatRepository.findOne({
        where: { id: chat.id },
        relations: ['participants', 'participants.user'],
      });
      this.logger.log('Retrieved saved chat with relations:', savedChat);

      return savedChat;
    } catch (error) {
      this.logger.error('Error creating chat:', error);
      throw error;
    }
  }

  async findAll(userId: string): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('participants.user.id = :userId', { userId })
      .getMany();
  }

  async searchChats(query: string, userId: string): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('participants.user.id = :userId', { userId })
      .andWhere('LOWER(chat.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();
  }

  async advancedSearch(query: string, userId: string): Promise<{
    messages: Array<{
      id: string;
      content: string;
      chatId: string;
      chatName: string;
    }>;
    chats: Chat[];
  }> {
    // Поиск по сообщениям
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .where('participants.user.id = :userId', { userId })
      .andWhere('LOWER(message.content) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('message.createdAt', 'DESC')
      .limit(10)
      .getMany();

    // Поиск по чатам
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('participants.user.id = :userId', { userId })
      .andWhere('LOWER(chat.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();

    return {
      messages: messages.map(message => ({
        id: message.id,
        content: message.content,
        chatId: message.chat.id,
        chatName: message.chat.name
      })),
      chats
    };
  }

  async findOne(chatId: string, userId: string): Promise<Chat> {
    this.logger.log(`Finding chat ${chatId} for user ${userId}`);

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });

    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Проверяем, является ли пользователь участником чата
    const participant = chat.participants.find(p => p.user.id === userId);
    if (!participant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }

    return chat;
  }

  async addParticipants(chatId: string, userId: string, updateRequest: UpdateChatParticipantsRequest): Promise<Chat> {
    this.logger.log(`Adding participants to chat ${chatId} by user ${userId}`);
    this.logger.log('Update request:', updateRequest);

    // Проверяем существование чата
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    this.logger.log('Found chat:', chat);

    // Проверяем права текущего пользователя
    const currentParticipant = chat.participants.find(p => p.user.id === userId);
    if (!currentParticipant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }
    if (currentParticipant.role !== Role.admin) {
      this.logger.error(`User ${userId} is not an admin of chat ${chatId}`);
      throw new UnauthorizedException('Only admins can add participants');
    }
    this.logger.log('Current participant is admin:', currentParticipant);

    // Добавляем новых участников
    for (const participant of updateRequest.participants) {
      this.logger.log('Processing participant:', participant);

      // Проверяем существование пользователя
      const user = await this.userRepository.findOne({ where: { id: participant.userId } });
      if (!user) {
        this.logger.error(`User with ID ${participant.userId} not found`);
        throw new NotFoundException(`User with ID ${participant.userId} not found`);
      }
      this.logger.log('Found user:', user);

      // Проверяем, не является ли пользователь уже участником
      const existingParticipant = chat.participants.find(p => p.user.id === participant.userId);
      if (existingParticipant) {
        // Обновляем роль существующего участника
        this.logger.log('Updating existing participant role:', existingParticipant);
        existingParticipant.role = participant.role;
        await this.chatParticipantRepository.save(existingParticipant);
        this.logger.log('Updated participant:', existingParticipant);
      } else {
        // Создаем нового участника
        this.logger.log('Creating new participant');
        const newParticipant = this.chatParticipantRepository.create({
          chat,
          user,
          role: participant.role,
        });
        await this.chatParticipantRepository.save(newParticipant);
        this.logger.log('Created new participant:', newParticipant);
      }
    }

    // Возвращаем обновленный чат
    const updatedChat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    this.logger.log('Returning updated chat:', updatedChat);
    return updatedChat;
  }

  async removeParticipants(chatId: string, userId: string, participantIds: string[]) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = chat.participants.some(p => p.user.id === userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    const isAdmin = chat.participants.find(p => p.user.id === userId)?.role === 'admin';
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can remove participants');
    }

    // Проверяем, что participantIds является массивом
    if (!Array.isArray(participantIds)) {
      throw new BadRequestException('participantIds must be an array');
    }

    // Удаляем участников
    await this.chatParticipantRepository.delete({
      chatId,
      userId: In(participantIds)
    });

    return { message: 'Participants removed successfully' };
  }

  async updateParticipantRole(chatId: string, userId: string, targetUserId: string, newRole: Role): Promise<Chat> {
    this.logger.log(`Updating participant role in chat ${chatId} by user ${userId}`);
    this.logger.log(`Target user: ${targetUserId}, New role: ${newRole}`);

    // Проверяем существование чата
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Проверяем права текущего пользователя
    const currentParticipant = chat.participants.find(p => p.user.id === userId);
    if (!currentParticipant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }
    if (currentParticipant.role !== Role.admin) {
      this.logger.error(`User ${userId} is not an admin of chat ${chatId}`);
      throw new UnauthorizedException('Only admins can update participant roles');
    }

    // Находим участника для обновления
    const targetParticipant = chat.participants.find(p => p.user.id === targetUserId);
    if (!targetParticipant) {
      this.logger.error(`User ${targetUserId} is not a participant of chat ${chatId}`);
      throw new NotFoundException(`User ${targetUserId} is not a participant of this chat`);
    }

    // Обновляем роль
    targetParticipant.role = newRole;
    await this.chatParticipantRepository.save(targetParticipant);
    this.logger.log(`Updated participant role to ${newRole}`);

    // Возвращаем обновленный чат
    return this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
  }

  async deleteChat(chatId: string, userId: string): Promise<void> {
    this.logger.log(`Deleting chat ${chatId} by user ${userId}`);

    // Проверяем существование чата
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Проверяем права текущего пользователя
    const currentParticipant = chat.participants.find(p => p.user.id === userId);
    if (!currentParticipant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }
    if (currentParticipant.role !== Role.admin) {
      this.logger.error(`User ${userId} is not an admin of chat ${chatId}`);
      throw new UnauthorizedException('Only admins can delete the chat');
    }

    // Удаляем чат (каскадное удаление удалит все связанные записи)
    await this.chatRepository.remove(chat);
    this.logger.log(`Chat ${chatId} deleted successfully`);
  }

  async leaveChat(chatId: string, userId: string): Promise<void> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants']
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Проверяем, является ли пользователь участником чата
    const isParticipant = chat.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new NotFoundException('You are not a participant of this chat');
    }

    // Удаляем участника из чата
    await this.chatParticipantRepository.delete({
      chatId,
      userId
    });

    // Если это был последний участник, удаляем чат
    if (chat.participants.length === 1) {
      await this.chatRepository.remove(chat);
    }
  }

  async createMessage(
    chatId: string, 
    userId: string, 
    createMessageRequest: CreateMessageRequest
  ): Promise<Message> {
    this.logger.log(`Creating message in chat ${chatId} by user ${userId}`);
    this.logger.log('Message request:', createMessageRequest);

    // Проверяем существование чата
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Проверяем, является ли пользователь участником чата
    const participant = chat.participants.find(p => p.user.id === userId);
    if (!participant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }

    // Проверяем, что есть хотя бы контент или файл
    if (!createMessageRequest.content && !createMessageRequest.fileUrl && !createMessageRequest.fileName) {
      throw new BadRequestException('Message must contain either content or file');
    }

    // Создаем сообщение
    const message = this.messageRepository.create({
      content: createMessageRequest.content || null,
      fileUrl: createMessageRequest.fileUrl || null,
      fileName: createMessageRequest.fileName || null,
      chat,
      user: participant.user,
    });

    // Сохраняем сообщение
    const savedMessage = await this.messageRepository.save(message);
    this.logger.log(`Message created with ID ${savedMessage.id}`);

    return savedMessage;
  }

  async getMessages(chatId: string, userId: string, page: number = 1, limit: number = 20): Promise<{ messages: Message[], total: number }> {
    this.logger.log(`Getting messages from chat ${chatId} for user ${userId}, page: ${page}, limit: ${limit}`);

    // Проверяем существование чата
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Проверяем, является ли пользователь участником чата
    const participant = chat.participants.find(p => p.user.id === userId);
    if (!participant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }

    // Убеждаемся, что page и limit являются числами
    const pageNumber = Math.max(1, Math.floor(page));
    const limitNumber = Math.max(1, Math.min(100, Math.floor(limit)));

    // Получаем сообщения с пагинацией
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { chat: { id: chatId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    this.logger.log(`Found ${total} messages, returning ${messages.length} messages for page ${pageNumber}`);
    return { messages, total };
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<{ updated: number }> {
    // Найти последнее сообщение в чате
    const lastMessage = await this.messageRepository.findOne({
      where: { chat: { id: chatId } },
      order: { createdAt: 'DESC' }
    });

    if (!lastMessage) {
      return { updated: 0 };
    }

    // Обновить lastReadMessageId у chat_participant
    const result = await this.chatParticipantRepository.update(
      { chatId, userId },
      { lastReadMessageId: lastMessage.id }
    );

    return { updated: result.affected || 0 };
  }

  async markMessagesAsUnread(chatId: string, userId: string): Promise<{ updated: number }> {
    // Найти последнее сообщение в чате
    const lastMessage = await this.messageRepository.findOne({
      where: { chat: { id: chatId } },
      order: { createdAt: 'DESC' }
    });

    if (!lastMessage) {
      return { updated: 0 };
    }

    // Обновить lastReadMessageId у chat_participant на null
    const result = await this.chatParticipantRepository.update(
      { chatId, userId },
      { lastReadMessageId: null }
    );

    return { updated: result.affected || 0 };
  }

  async getChatsWithLastMessage(userId: string): Promise<Chat[]> {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .leftJoinAndSelect(
        'chat.messages',
        'message',
        `message.id = (
          SELECT m.id FROM messages m
          WHERE m."chatId" = chat.id
          ORDER BY m."createdAt" DESC
          LIMIT 1
        )`
      )
      .leftJoinAndSelect('message.user', 'messageUser')
      .addSelect(`(
        SELECT COUNT(*) FROM messages m
        WHERE m."chatId" = chat.id
          AND m."createdAt" > COALESCE((
            SELECT msg."createdAt" FROM messages msg WHERE msg.id = cp."lastReadMessageId"
          ), '1970-01-01')
          AND m."senderId" != :userId
      )`, 'unreadCount')
      .leftJoin('chat_participants', 'cp', 'cp."chatId" = chat.id AND cp."userId" = :userId', { userId })
      .where('participant.userId = :userId', { userId })
      .orderBy('chat.updatedAt', 'DESC')
      .getRawAndEntities();

    return chats.entities.map((chat, index) => ({
      ...chat,
      unreadCount: parseInt(chats.raw[index]?.unreadCount || '0', 10)
    }));
  }

  async updateChatName(chatId: string, userId: string, name: string): Promise<Chat> {
    this.logger.log(`Updating chat name for chat ${chatId} by user ${userId}`);

    // Проверяем существование чата
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });
    if (!chat) {
      this.logger.error(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Проверяем права текущего пользователя
    const currentParticipant = chat.participants.find(p => p.user.id === userId);
    if (!currentParticipant) {
      this.logger.error(`User ${userId} is not a participant of chat ${chatId}`);
      throw new UnauthorizedException('You are not a participant of this chat');
    }
    if (currentParticipant.role !== Role.admin) {
      this.logger.error(`User ${userId} is not an admin of chat ${chatId}`);
      throw new UnauthorizedException('Only admins can update chat name');
    }

    // Обновляем название чата
    chat.name = name;
    await this.chatRepository.save(chat);
    this.logger.log(`Chat name updated to ${name}`);

    return chat;
  }

  async getChatParticipants(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'participants.user'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = chat.participants.some(p => p.user.id === userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    return chat.participants;
  }
} 