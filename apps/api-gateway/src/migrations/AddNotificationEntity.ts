import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationEntity1719301000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "user_id" uuid REFERENCES "users"("id"),
        "type" varchar DEFAULT 'general',
        "content" text NOT NULL,
        "link" varchar,
        "meta" jsonb,
        "is_read" boolean DEFAULT false,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      CREATE INDEX idx_notification_tenant ON "notifications"("tenant_id");
      CREATE INDEX idx_notification_user ON "notifications"("user_id");
      CREATE INDEX idx_notification_is_read ON "notifications"("is_read");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "notifications";');
  }
} 