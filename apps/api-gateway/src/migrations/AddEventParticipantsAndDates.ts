import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventParticipantsAndDates implements MigrationInterface {
  name = 'AddEventParticipantsAndDates'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // created_by 컬럼 추가 및 기존 user_id → created_by로 이름 변경
    await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "user_id" TO "created_by"`);
    // start_at, end_at 추가
    await queryRunner.query(`ALTER TABLE "events" ADD "start_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "events" ADD "end_at" TIMESTAMP`);
    // participants 다대다 테이블 생성
    await queryRunner.query(`CREATE TABLE "event_participants" (
      "event_id" uuid NOT NULL,
      "user_id" uuid NOT NULL,
      CONSTRAINT "PK_event_participants" PRIMARY KEY ("event_id", "user_id"),
      CONSTRAINT "FK_event_participants_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_event_participants_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event_participants"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "end_at"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "start_at"`);
    await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "created_by" TO "user_id"`);
  }
} 