import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
    @ApiProperty({
        description: 'Success status',
        example: true
    })
    success: boolean;

    @ApiProperty({
        description: 'JWT token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    token: string;
}