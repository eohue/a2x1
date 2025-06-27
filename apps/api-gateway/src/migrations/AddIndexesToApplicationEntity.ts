import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesToApplicationEntity implements MigrationInterface {
    name = 'AddIndexesToApplicationEntity'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_tenant_id" ON "applications" ("tenant_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_user_id" ON "applications" ("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_house_id" ON "applications" ("house_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_status" ON "applications" ("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_created_at" ON "applications" ("created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_composite" ON "applications" ("tenant_id", "user_id", "house_id", "status", "created_at")`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fcm_token" varchar;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_composite"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_house_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "fcm_token";`);
    }
} 