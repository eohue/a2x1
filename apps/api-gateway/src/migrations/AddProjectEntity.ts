import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectEntity1719470000000 implements MigrationInterface {
  name = 'AddProjectEntity1719470000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "name" varchar(100) NOT NULL,
        "description" text,
        "pdf_url" varchar,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "projects"');
  }
} 