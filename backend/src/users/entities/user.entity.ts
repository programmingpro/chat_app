import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { ChatParticipant } from '../../chat/entities/chat_participant.entity';
import { Message } from '../../chat/entities/message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Email address',
        example: 'john.doe@example.com'
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        description: 'Username',
        example: 'johndoe'
    })
    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @ApiProperty({
        description: 'First name',
        example: 'John'
    })
    @Column({ nullable: true })
    firstName: string;

    @ApiProperty({
        description: 'Last name',
        example: 'Doe'
    })
    @Column({ nullable: true })
    lastName: string;

    @ApiProperty({
        description: 'Two-factor authentication status',
        example: false
    })
    @Column({ default: false })
    twoFactorAuth: boolean;

    @ApiProperty({
        description: 'Push notifications status',
        example: true
    })
    @Column({ default: true })
    pushNotifications: boolean;

    @ApiProperty({
        description: 'Notification sound status',
        example: true
    })
    @Column({ default: true })
    notificationSound: boolean;

    @ApiProperty({
        description: 'Dark theme preference',
        example: false
    })
    @Column({ default: false })
    darkTheme: boolean;

    @Column({ nullable: true })
    avatarUrl?: string;

    @OneToMany(() => ChatParticipant, participant => participant.user)
    chatParticipants: ChatParticipant[];

    @OneToMany(() => Message, message => message.user)
    messages: Message[];

    @ApiProperty({
        description: 'Creation date',
        example: '2024-01-01T00:00:00.000Z'
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: 'Last update date',
        example: '2024-01-01T00:00:00.000Z'
    })
    @UpdateDateColumn()
    updatedAt: Date;
}
