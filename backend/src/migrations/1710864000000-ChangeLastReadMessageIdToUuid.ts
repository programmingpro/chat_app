import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeLastReadMessageIdToUuid1710864000000 implements MigrationInterface {
    name = 'ChangeLastReadMessageIdToUuid1710864000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Сначала удаляем существующее ограничение внешнего ключа
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT IF EXISTS "FK_chat_participants_last_read_message"`);
        
        // Изменяем тип колонки на uuid
        await queryRunner.query(`ALTER TABLE "chat_participants" ALTER COLUMN "lastReadMessageId" TYPE uuid USING NULL`);
        
        // Добавляем новое ограничение внешнего ключа
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_chat_participants_last_read_message" FOREIGN KEY ("lastReadMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем ограничение внешнего ключа
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT IF EXISTS "FK_chat_participants_last_read_message"`);
        
        // Возвращаем тип колонки на integer
        await queryRunner.query(`ALTER TABLE "chat_participants" ALTER COLUMN "lastReadMessageId" TYPE integer USING NULL`);
    }
} 