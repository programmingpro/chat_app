import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../common/Enum/Role';
import { Message } from './message.entity';

@Entity('chat_participants')
@Index(['chatId', 'userId'], { unique: true }) // Пользователь может быть только один раз в чате
@Index(['userId']) // Для быстрого поиска чатов пользователя
@Index(['chatId', 'role']) // Для быстрого поиска администраторов/модераторов чата
export class ChatParticipant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.member
    })
    role: Role;

    @ManyToOne(() => Chat, chat => chat.participants, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn({ name: 'chatId' })
    chat: Chat;

    @Column()
    chatId: string;

    @ManyToOne(() => User, user => user.chatParticipants, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn({ name: 'lastReadMessageId' })
    lastReadMessage: Message;

    @Column({ type: 'uuid', nullable: true })
    lastReadMessageId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}