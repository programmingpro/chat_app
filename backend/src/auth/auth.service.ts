import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginRequest } from '../common/DTO/LoginRequest';
import { LoginResponse } from '../common/DTO/LoginResponse';
import { RegisterRequest } from '../common/DTO/RegisterRequest';
import { RegisterResponse } from '../common/DTO/RegisterResponse';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const { email, password, firstName, lastName } = registerRequest;

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username: email, // Using email as username for now
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    };
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest;

    // Find user
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return { success: true, token };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
} 