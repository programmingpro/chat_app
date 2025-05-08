import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileRequest } from '../common/DTO/UpdateProfileRequest';
import { UpdatePasswordRequest } from '../common/DTO/UpdatePasswordRequest';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'username', 'firstName', 'lastName'],
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: string, updateData: UpdateProfileRequest): Promise<User> {
    const user = await this.findById(userId);
    
    // Обновляем базовую информацию
    if (updateData.firstName !== undefined) {
      user.firstName = updateData.firstName;
    }
    if (updateData.lastName !== undefined) {
      user.lastName = updateData.lastName;
    }
    if (updateData.email !== undefined) {
      // Проверяем, не занят ли email другим пользователем
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new UnauthorizedException('Email is already taken');
      }
      user.email = updateData.email;
    }
    if (updateData.username !== undefined) {
      user.username = updateData.username;
    }
    
    // Обновляем настройки
    if (updateData.twoFactorAuth !== undefined) {
      user.twoFactorAuth = updateData.twoFactorAuth;
    }
    if (updateData.pushNotifications !== undefined) {
      user.pushNotifications = updateData.pushNotifications;
    }
    if (updateData.notificationSound !== undefined) {
      user.notificationSound = updateData.notificationSound;
    }
    if (updateData.darkTheme !== undefined) {
      user.darkTheme = updateData.darkTheme;
    }

    return this.usersRepository.save(user);
  }

  async updatePassword(id: string, passwordData: UpdatePasswordRequest): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Хешируем и сохраняем новый пароль
    user.password = await bcrypt.hash(passwordData.newPassword, 10);
    await this.usersRepository.save(user);
  }
} 