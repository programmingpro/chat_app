import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1743027468322 implements MigrationInterface {
    name = 'Initial1743027468322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "senderId" uuid NOT NULL, "chatId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40dc3de52ed041e48cfb116f2a" ON "messages" ("senderId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_500d64127ca9df75640c19af40" ON "messages" ("chatId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chatType" "public"."chats_chattype_enum" NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2eb84efc93976230c81bce1b59" ON "chats" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_f63b5cc5bf67e5251f28301d7e" ON "chats" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_9318b026b0886396fdade51b48" ON "chats" ("chatType") `);
        await queryRunner.query(`CREATE TABLE "chat_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."chat_participants_role_enum" NOT NULL, "chatId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ebf68c52a2b4dceb777672b782d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_68dedada1bc6c79f334ac1b540" ON "chat_participants" ("chatId", "role") `);
        await queryRunner.query(`CREATE INDEX "IDX_fb6add83b1a7acc94433d38569" ON "chat_participants" ("userId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d3101b19215e8540d891f98c06" ON "chat_participants" ("chatId", "userId") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "twoFactorAuth" boolean NOT NULL DEFAULT false, "pushNotifications" boolean NOT NULL DEFAULT true, "notificationSound" boolean NOT NULL DEFAULT true, "darkTheme" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_fb6add83b1a7acc94433d385692" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_fb6add83b1a7acc94433d385692"`);
        await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3101b19215e8540d891f98c06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb6add83b1a7acc94433d38569"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68dedada1bc6c79f334ac1b540"`);
        await queryRunner.query(`DROP TABLE "chat_participants"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9318b026b0886396fdade51b48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f63b5cc5bf67e5251f28301d7e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2eb84efc93976230c81bce1b59"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_500d64127ca9df75640c19af40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40dc3de52ed041e48cfb116f2a"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
