import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterRequest {
    @ApiProperty({
        description: 'User first name',
        example: 'John'
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe'
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password (min 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character)',
        example: 'StrongPass123!'
    })
    @IsString()
    @Length(8, 30)
    @IsNotEmpty()
    password: string;
}