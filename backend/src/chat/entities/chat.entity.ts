import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChatParticipant } from './chat_participant.entity';
import { Message } from './message.entity';
import { ChatType } from '../../common/Enum/ChatType';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: ChatType,
        default: ChatType.private
    })
    chatType: ChatType;

    @OneToMany(() => ChatParticipant, participant => participant.chat)
    participants: ChatParticipant[];

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}