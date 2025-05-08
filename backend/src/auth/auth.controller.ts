import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from '../common/DTO/LoginRequest';
import { LoginResponse } from '../common/DTO/LoginResponse';
import { RegisterRequest } from '../common/DTO/RegisterRequest';
import { RegisterResponse } from '../common/DTO/RegisterResponse';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterRequest })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: RegisterResponse
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User with this email already exists' 
  })
  async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(registerRequest);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: LoginResponse
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(loginRequest);
  }
} 