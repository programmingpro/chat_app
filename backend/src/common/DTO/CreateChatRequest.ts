// dtos/CreateChatRequest.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatType } from '../Enum/ChatType';
import { Role } from '../Enum/Role';

class ChatParticipantDto {
  @ApiProperty({ description: 'ID пользователя' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: Role, description: 'Роль участника в чате' })
  @IsEnum(Role)
  role: Role;
}

export class CreateChatRequest {
  @ApiProperty({ description: 'Название чата' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ChatType, description: 'Тип чата' })
  @IsEnum(ChatType)
  chatType: ChatType;

  @ApiProperty({ type: [ChatParticipantDto], description: 'Список участников чата' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatParticipantDto)
  participants: ChatParticipantDto[];
}