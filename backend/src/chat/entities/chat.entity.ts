import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChatParticipant } from './chat_participant.entity';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';
import { ChatType } from '../../common/Enum/ChatType';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({
        type: 'enum',
        enum: ChatType,
        default: ChatType.private
    })
    chatType: ChatType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @Column()
    createdById: string;

    @OneToMany(() => ChatParticipant, participant => participant.chat)
    participants: ChatParticipant[];

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}