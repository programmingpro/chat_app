import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from './entities/chat_participant.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatParticipant, User, Message]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {} 