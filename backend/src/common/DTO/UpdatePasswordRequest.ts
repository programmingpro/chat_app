import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class UpdatePasswordRequest {
    @ApiProperty({
        description: 'Current password',
        example: 'CurrentPass123!',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: 'New password (min 8 characters)',
        example: 'NewPass123!',
        required: true
    })
    @IsString()
    @Length(8, 30)
    @IsNotEmpty()
    newPassword: string;
} 