import { Controller, Get, Post, Body, Patch, Param, UseGuards, UnauthorizedException, UseInterceptors, UploadedFile, BadRequestException, Query, Request, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileRequest } from '../common/DTO/UpdateProfileRequest';
import { UpdatePasswordRequest } from '../common/DTO/UpdatePasswordRequest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as UserDecorator } from '../auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Express } from 'express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns filtered users',
    type: [User]
  })
  async searchUsers(@Request() req) {
    const query = req.query.query || '';
    return this.usersService.searchUsers(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all users',
    type: [User]
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns current user profile',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  async getProfile(@UserDecorator() currentUser: any): Promise<User> {
    return this.usersService.findById(currentUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns user by ID',
    type: User
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async updateProfile(
    @UserDecorator() currentUser: any,
    @Body() updateProfileRequest: UpdateProfileRequest
  ): Promise<User> {
    console.log('Update profile request received for user:', currentUser.id);
    console.log('Request body:', updateProfileRequest);
    
    try {
      const updatedUser = await this.usersService.updateProfile(currentUser.id, updateProfileRequest);
      console.log('Profile updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error in updateProfile controller:', error);
      throw error;
    }
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password updated successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async updatePassword(
    @UserDecorator() currentUser: any,
    @Body() updatePasswordRequest: UpdatePasswordRequest
  ): Promise<void> {
    console.log('Update password request received for user:', currentUser.id);
    console.log('Request body:', {
      currentPasswordLength: updatePasswordRequest.currentPassword?.length,
      newPasswordLength: updatePasswordRequest.newPassword?.length
    });
    
    try {
      await this.usersService.updatePassword(currentUser.id, updatePasswordRequest);
      console.log('Password updated successfully for user:', currentUser.id);
    } catch (error) {
      console.error('Error in updatePassword controller:', error);
      throw error;
    }
  }

  @Patch('profile/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded successfully', type: User })
  async uploadAvatar(
    @UserDecorator() currentUser: any,
    @UploadedFile() file: any
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const avatarUrl = `/uploads/avatars/${file.filename}`;
      const updatedUser = await this.usersService.updateProfile(currentUser.id, { avatarUrl });
      return updatedUser;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new BadRequestException('Failed to update avatar');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User removed successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
} 