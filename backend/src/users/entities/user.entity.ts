import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ChatParticipant } from '../../chat/entities/chat_participant.entity';
import { Message } from '../../chat/entities/message.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Length(2, 30)
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ default: false })
    twoFactorAuth: boolean;

    @Column({ default: true })
    pushNotifications: boolean;

    @Column({ default: true })
    notificationSound: boolean;

    @Column({ default: false })
    darkTheme: boolean;

    @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.user)
    chatParticipants: ChatParticipant[];

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
