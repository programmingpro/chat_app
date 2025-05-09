import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileRequest } from '../common/DTO/UpdateProfileRequest';
import { UpdatePasswordRequest } from '../common/DTO/UpdatePasswordRequest';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

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
      throw new NotFoundException('User not found');
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

  async updateProfile(userId: string, updateProfileRequest: UpdateProfileRequest): Promise<User> {
    try {
      console.log('Updating profile for user:', userId);
      console.log('Update data:', updateProfileRequest);

      const user = await this.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      // Обновляем только те поля, которые пришли в запросе
      if (updateProfileRequest.firstName !== undefined) {
        user.firstName = updateProfileRequest.firstName;
      }
      if (updateProfileRequest.lastName !== undefined) {
        user.lastName = updateProfileRequest.lastName;
      }
      if (updateProfileRequest.email !== undefined) {
        user.email = updateProfileRequest.email;
      }
      if (updateProfileRequest.username !== undefined) {
        user.username = updateProfileRequest.username;
      }
      if (updateProfileRequest.avatarUrl !== undefined) {
        user.avatarUrl = updateProfileRequest.avatarUrl;
      }
      if (updateProfileRequest.twoFactorAuth !== undefined) {
        user.twoFactorAuth = updateProfileRequest.twoFactorAuth;
      }
      if (updateProfileRequest.pushNotifications !== undefined) {
        user.pushNotifications = updateProfileRequest.pushNotifications;
      }
      if (updateProfileRequest.notificationSound !== undefined) {
        user.notificationSound = updateProfileRequest.notificationSound;
      }
      if (updateProfileRequest.darkTheme !== undefined) {
        user.darkTheme = updateProfileRequest.darkTheme;
      }

      console.log('Saving updated user:', user);
      // Сохраняем обновленного пользователя
      const updatedUser = await this.usersRepository.save(user);
      console.log('User saved successfully');
      
      // Возвращаем обновленного пользователя без пароля
      const { password, ...result } = updatedUser;
      return result as User;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async updatePassword(id: string, passwordData: UpdatePasswordRequest): Promise<void> {
    try {
      console.log('Updating password for user:', id);
      console.log('Password data:', { 
        currentPasswordLength: passwordData.currentPassword?.length,
        newPasswordLength: passwordData.newPassword?.length 
      });

      const user = await this.usersRepository.findOne({
        where: { id },
        select: ['id', 'password'],
      });

      console.log('User found:', !!user);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Проверяем текущий пароль
      console.log('Comparing current password...');
      const isPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
      console.log('Current password valid:', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Проверяем, что новый пароль отличается от текущего
      console.log('Checking if new password is different...');
      const isSamePassword = await bcrypt.compare(passwordData.newPassword, user.password);
      console.log('New password is same as current:', isSamePassword);

      if (isSamePassword) {
        throw new BadRequestException('New password must be different from the current password');
      }

      // Хешируем и сохраняем новый пароль
      console.log('Hashing new password...');
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
      user.password = hashedPassword;
      
      console.log('Saving updated user...');
      await this.usersRepository.save(user);
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error instanceof NotFoundException || 
          error instanceof UnauthorizedException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update password');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query) {
      return this.usersRepository.find();
    }

    return this.usersRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { username: Like(`%${query}%`) },
        { email: Like(`%${query}%`) }
      ]
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
} 