import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'StrongPass123!'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}