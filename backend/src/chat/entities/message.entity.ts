import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Chat } from './chat.entity';

@Entity('messages')
@Index(['chatId', 'createdAt']) // Для быстрой загрузки сообщений чата по дате
@Index(['senderId', 'createdAt']) // Для быстрого поиска сообщений пользователя
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.messages, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    senderId: string;

    @ManyToOne(() => Chat, chat => chat.messages, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn({ name: 'chatId' })
    chat: Chat;

    @Column()
    chatId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}