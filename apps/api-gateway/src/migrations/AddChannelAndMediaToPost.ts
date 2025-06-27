import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChannelAndMediaToPost1719302000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD COLUMN IF NOT EXISTS "channel" varchar DEFAULT '일반',
      ADD COLUMN IF NOT EXISTS "image_url" varchar,
      ADD COLUMN IF NOT EXISTS "video_url" varchar;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts"
      DROP COLUMN IF EXISTS "channel",
      DROP COLUMN IF EXISTS "image_url",
      DROP COLUMN IF EXISTS "video_url";
    `);
  }
} 