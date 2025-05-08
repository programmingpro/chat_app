import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageRequest {
    @ApiProperty({
        description: 'Content of the message',
        example: 'Hello, everyone!'
    })
    @IsString()
    @IsNotEmpty()
    content: string;
} 