import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToPostEntity implements MigrationInterface {
  name = 'AddStatusToPostEntity';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "status" varchar NOT NULL DEFAULT 'approved'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "status"`);
  }
} 