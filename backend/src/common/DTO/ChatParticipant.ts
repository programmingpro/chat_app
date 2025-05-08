import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { Role } from '../Enum/Role';

export class ChatParticipant {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'Role in the chat',
        enum: Role,
        example: Role.admin
    })
    @IsEnum(Role)
    role: Role;
}