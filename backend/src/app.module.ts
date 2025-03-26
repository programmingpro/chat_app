import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ChatParticipant } from './chat/entities/chat_participant.entity';
import { Chat } from './chat/entities/chat.entity';
import { Message } from './chat/entities/message.entity';
import { User } from './users/entities/user.entity';

const { 
  POSTGRES_USER, 
  POSTGRES_PASSWORD, 
  POSTGRES_DB, 
  POSTGRES_HOST, 
  POSTGRES_PORT 
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [ChatParticipant, Chat, Message, User],
      synchronize: false,
      schema: 'public'
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    // TODO:Список модулей
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}