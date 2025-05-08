import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, IsNotEmpty } from 'class-validator';

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
        description: 'New password (min 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character)',
        example: 'NewPass123!',
        required: true
    })
    @IsString()
    @Length(8, 30)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak',
    })
    @IsNotEmpty()
    newPassword: string;
} 