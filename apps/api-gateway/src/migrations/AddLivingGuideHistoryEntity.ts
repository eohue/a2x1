import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLivingGuideHistoryEntity1719303000000 implements MigrationInterface {
    name = 'AddLivingGuideHistoryEntity1719303000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "living_guide_histories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "guide_id" uuid NOT NULL,
                "version" integer NOT NULL,
                "content" text NOT NULL,
                "status" character varying(20) NOT NULL,
                "change_type" character varying(20) NOT NULL,
                "changed_by" uuid NOT NULL,
                "changed_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_living_guide_histories_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_living_guide_histories_guide_id" FOREIGN KEY ("guide_id") REFERENCES "living_guides"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_living_guide_histories_changed_by" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "living_guide_histories"`);
    }
} 