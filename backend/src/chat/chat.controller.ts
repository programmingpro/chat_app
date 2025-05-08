import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete, Query } from '@nestjs/common';
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
  async createChat(@Body() createChatRequest: CreateChatRequest): Promise<Chat> {
    return this.chatService.createChat(createChatRequest);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats' })
  @ApiResponse({ status: 200, description: 'Return all chats', type: [Chat] })
  async findAll(): Promise<Chat[]> {
    return this.chatService.findAll();
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

  @Post(':chatId/leave')
  @ApiOperation({ summary: 'Leave a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  leaveChat(
    @Param('chatId') chatId: string,
    @User('id') userId: string,
  ) {
    return this.chatService.leaveChat(chatId, userId);
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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.chatService.getMessages(chatId, userId, page, limit);
  }
} 