import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequest {
    @ApiProperty({
        description: 'Имя пользователя',
        required: false
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({
        description: 'Фамилия пользователя',
        required: false
    })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({
        description: 'Email пользователя',
        required: false
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Имя пользователя (username)',
        required: false
    })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({
        description: 'URL аватара пользователя',
        required: false
    })
    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @ApiProperty({
        description: 'Enable/disable two-factor authentication',
        example: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    twoFactorAuth?: boolean;

    @ApiProperty({
        description: 'Enable/disable push notifications',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    pushNotifications?: boolean;

    @ApiProperty({
        description: 'Enable/disable notification sound',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    notificationSound?: boolean;

    @ApiProperty({
        description: 'Enable/disable dark theme',
        example: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    darkTheme?: boolean;
}