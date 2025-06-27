import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLivingGuideEntity1719302000000 implements MigrationInterface {
    name = 'AddLivingGuideEntity1719302000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "living_guides" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(100) NOT NULL,
                "content" text NOT NULL,
                "status" character varying(20) NOT NULL DEFAULT 'draft',
                "version" integer NOT NULL DEFAULT 1,
                "created_by" uuid NOT NULL,
                "approved_by" uuid,
                "approved_at" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_living_guides_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_living_guides_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_living_guides_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "living_guides"`);
    }
} 