import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat_participants')
export class ChatParticipant {
    @PrimaryGeneratedColumn()
    id: number;
}