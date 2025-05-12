import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadByToMessages1746567074227 implements MigrationInterface {
    name = 'AddReadByToMessages1746567074227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN "readBy" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "readBy"`);
    }
} 