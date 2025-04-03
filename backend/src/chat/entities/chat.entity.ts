import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ChatParticipant } from './chat_participant.entity';
import { ChatType } from '../../../../common/Enum/ChatType';
import { Message } from './message.entity';

@Entity('chats')
@Index(['chatType'])
@Index(['name'])
@Index(['createdAt'])
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ChatType
    })
    chatType: ChatType;

    @Column()
    name: string;

    @OneToMany(() => ChatParticipant, participant => participant.chat)
    participants: ChatParticipant[];

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}