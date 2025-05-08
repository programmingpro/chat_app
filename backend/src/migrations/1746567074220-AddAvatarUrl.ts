import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrl1746567074220 implements MigrationInterface {
    name = 'AddAvatarUrl1746567074220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    }
}
