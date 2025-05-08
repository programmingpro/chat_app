import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com'
    })
    email: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John'
    })
    firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe'
    })
    lastName: string;

    @ApiProperty({
        description: 'JWT token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    token: string;
}