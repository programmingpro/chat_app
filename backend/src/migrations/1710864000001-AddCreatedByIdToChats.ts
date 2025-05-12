import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByIdToChats1710864000001 implements MigrationInterface {
    name = 'AddCreatedByIdToChats1710864000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Сначала добавляем колонку как nullable
        await queryRunner.query(`ALTER TABLE "chats" ADD "createdById" uuid NULL`);
        
        // Обновляем существующие записи, устанавливая createdById равным id первого участника чата
        await queryRunner.query(`
            UPDATE "chats" c
            SET "createdById" = (
                SELECT cp."userId"
                FROM "chat_participants" cp
                WHERE cp."chatId" = c.id
                LIMIT 1
            )
        `);
        
        // Теперь делаем колонку NOT NULL
        await queryRunner.query(`ALTER TABLE "chats" ALTER COLUMN "createdById" SET NOT NULL`);
        
        // Добавляем внешний ключ
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_chats_created_by" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_chats_created_by"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP COLUMN "createdById"`);
    }
} 