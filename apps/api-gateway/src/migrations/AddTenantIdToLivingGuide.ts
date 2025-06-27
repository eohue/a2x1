import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToLivingGuide1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "living_guides" ADD COLUMN "tenant_id" varchar(36) NOT NULL DEFAULT 'default'`);
    await queryRunner.query(`ALTER TABLE "living_guide_histories" ADD COLUMN "tenant_id" varchar(36) NOT NULL DEFAULT 'default'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "living_guides" DROP COLUMN "tenant_id"`);
    await queryRunner.query(`ALTER TABLE "living_guide_histories" DROP COLUMN "tenant_id"`);
  }
} 