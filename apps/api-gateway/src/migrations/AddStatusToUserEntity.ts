import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToUserEntity implements MigrationInterface {
  name = 'AddStatusToUserEntity';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "status" varchar NOT NULL DEFAULT 'pending'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
  }
} 