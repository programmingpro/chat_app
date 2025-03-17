import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;
}