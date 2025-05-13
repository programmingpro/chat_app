import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSettingsRequest {
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