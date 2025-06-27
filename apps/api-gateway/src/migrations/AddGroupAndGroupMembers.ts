import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroupAndGroupMembers1719303000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "groups" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "thumbnail_url" varchar,
        "created_by" uuid NOT NULL,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false,
        CONSTRAINT "UQ_group_tenant_name" UNIQUE ("tenant_id", "name"),
        CONSTRAINT "FK_group_created_by" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "IDX_group_tenant_id" ON "groups" ("tenant_id");
      CREATE INDEX IF NOT EXISTS "IDX_group_created_by" ON "groups" ("created_by");

      -- 소모임 멤버 N:M 테이블
      CREATE TABLE IF NOT EXISTS "group_members" (
        "group_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_group_members" PRIMARY KEY ("group_id", "user_id"),
        CONSTRAINT "FK_group_members_group" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_group_members_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "IDX_group_members_group_id" ON "group_members" ("group_id");
      CREATE INDEX IF NOT EXISTS "IDX_group_members_user_id" ON "group_members" ("user_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "group_members";
      DROP TABLE IF EXISTS "groups";
    `);
  }
} 