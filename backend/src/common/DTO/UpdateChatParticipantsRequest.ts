import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatParticipant } from './ChatParticipant';

export class UpdateChatParticipantsRequest {
    @ApiProperty({
        description: 'List of participants to add or update',
        type: [ChatParticipant],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatParticipant)
    participants: ChatParticipant[];
} 