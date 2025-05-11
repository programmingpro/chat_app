import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateMessageRequest {
    @ApiProperty({
        description: 'Message content',
        example: 'Hello, everyone!'
    })
    @IsOptional()
    @ValidateIf((o) => !o.fileUrl && !o.fileName)
    @IsString()
    content?: string;

    @ApiProperty({
        description: 'File URL',
        example: '/uploads/abc.pdf',
        required: false
    })
    @IsOptional()
    @IsString()
    fileUrl?: string;

    @ApiProperty({
        description: 'File name',
        example: 'abc.pdf',
        required: false
    })
    @IsOptional()
    @IsString()
    fileName?: string;
} 