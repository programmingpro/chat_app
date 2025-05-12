import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatRequest } from '../common/DTO/CreateChatRequest';
import { UpdateChatParticipantsRequest } from '../common/DTO/UpdateChatParticipantsRequest';
import { Chat } from './entities/chat.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { Role } from '../common/Enum/Role';
import { CreateMessageRequest } from '../common/DTO/CreateMessageRequest';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({ status: 201, description: 'Chat created successfully', type: Chat })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createChat(
    @Body() createChatRequest: CreateChatRequest,
    @User('id') userId: string
  ): Promise<Chat> {
    return this.chatService.createChat(createChatRequest, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats' })
  @ApiResponse({ status: 200, description: 'Return all chats', type: [Chat] })
  async getChats(@User('id') userId: string): Promise<Chat[]> {
    return this.chatService.getChatsWithLastMessage(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search chats by name' })
  async searchChats(
    @Query('query') query: string,
    @User('id') userId: string
  ): Promise<Chat[]> {
    return this.chatService.searchChats(query, userId);
  }

  @Get('advanced-search')
  @ApiOperation({ summary: 'Advanced search through messages and chats' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns search results with messages and chats',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              chatId: { type: 'string' },
              chatName: { type: 'string' }
            }
          }
        },
        chats: {
          type: 'array',
          items: { $ref: '#/components/schemas/Chat' }
        }
      }
    }
  })
  async advancedSearch(
    @Query('query') query: string,
    @User('id') userId: string
  ) {
    return this.chatService.advancedSearch(query, userId);
  }

  @Get(':chatId')
  @ApiOperation({ summary: 'Get a chat by ID' })
  @ApiResponse({ status: 200, description: 'Return the chat', type: Chat })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  async findOne(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
  ): Promise<Chat> {
    return this.chatService.findOne(chatId, userId);
  }

  @Patch(':chatId/participants')
  @ApiOperation({ summary: 'Add or update participants in a chat' })
  addParticipants(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
    @Body() updateRequest: UpdateChatParticipantsRequest,
  ) {
    return this.chatService.addParticipants(chatId, userId, updateRequest);
  }

  @Delete(':chatId/participants')
  @ApiOperation({ summary: 'Remove participants from a chat' })
  removeParticipants(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
    @Body() participantIds: string[],
  ) {
    return this.chatService.removeParticipants(chatId, userId, participantIds);
  }

  @Patch(':chatId/participants/:targetUserId/role')
  @ApiOperation({ summary: 'Update participant role in a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiParam({ name: 'targetUserId', description: 'Target user ID' })
  updateParticipantRole(
    @Param('chatId') chatId: string,
    @Param('targetUserId') targetUserId: string,
    @User('id') userId: string,
    @Body('role') newRole: Role,
  ) {
    return this.chatService.updateParticipantRole(chatId, userId, targetUserId, newRole);
  }

  @Delete(':chatId')
  @ApiOperation({ summary: 'Delete a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  deleteChat(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
  ) {
    return this.chatService.deleteChat(chatId, userId);
  }

  @Delete(':chatId/leave')
  @ApiOperation({ summary: 'Leave chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  async leaveChat(
    @Param('chatId') chatId: string,
    @Request() req
  ) {
    return this.chatService.leaveChat(chatId, req.user.id);
  }

  @Post(':chatId/messages')
  @ApiOperation({ summary: 'Create a message in a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  createMessage(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
    @Body() createMessageRequest: CreateMessageRequest,
  ) {
    return this.chatService.createMessage(chatId, userId, createMessageRequest);
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: 'Get messages from a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Messages per page (default: 20)' })
  getMessages(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.chatService.getMessages(
      chatId, 
      userId, 
      parseInt(page, 10) || 1, 
      parseInt(limit, 10) || 20
    );
  }

  @Patch(':chatId/messages/read')
  @ApiOperation({ summary: 'Mark all messages as read in a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  async markMessagesAsRead(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
  ) {
    return this.chatService.markMessagesAsRead(chatId, userId);
  }

  @Patch(':chatId/messages/unread')
  @ApiOperation({ summary: 'Mark last message as unread in a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  async markMessagesAsUnread(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
  ) {
    return this.chatService.markMessagesAsUnread(chatId, userId);
  }

  @Patch(':chatId/name')
  @ApiOperation({ summary: 'Update chat name' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  async updateChatName(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
    @Body('name') name: string,
  ) {
    return this.chatService.updateChatName(chatId, userId, name);
  }

  @Get(':chatId/participants')
  @ApiOperation({ summary: 'Get chat participants' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @UseGuards(JwtAuthGuard)
  async getChatParticipants(
    @Param('chatId') chatId: string,
    @Request() req
  ) {
    return this.chatService.getChatParticipants(chatId, req.user.id);
  }
} 