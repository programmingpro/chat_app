import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ nullable: true })
    fileName: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({ name: 'chatId' })
    chat: Chat;

    @Column()
    chatId: string;

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn({ name: 'senderId' })
    user: User;

    @Column()
    senderId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('simple-array', { nullable: true })
    readBy: string[];
}