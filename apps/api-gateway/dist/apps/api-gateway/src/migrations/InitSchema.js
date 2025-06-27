"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1719300000000 = void 0;
class InitSchema1719300000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "houses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "address" varchar,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "email" varchar NOT NULL,
        "name" varchar NOT NULL,
        "phone" varchar,
        "role" varchar DEFAULT 'resident',
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false,
        "password" varchar NOT NULL,
        CONSTRAINT unique_tenant_email UNIQUE ("tenant_id", "email")
      );
      
      CREATE TABLE "posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "user_id" uuid REFERENCES "users"("id"),
        "house_id" uuid REFERENCES "houses"("id"),
        "title" varchar NOT NULL,
        "content" text NOT NULL,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      
      CREATE TABLE "comments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "user_id" uuid REFERENCES "users"("id"),
        "post_id" uuid REFERENCES "posts"("id"),
        "content" text NOT NULL,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      
      CREATE TABLE "events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "house_id" uuid REFERENCES "houses"("id"),
        "user_id" uuid REFERENCES "users"("id"),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "event_date" timestamptz NOT NULL,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      
      CREATE TABLE "applications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "user_id" uuid REFERENCES "users"("id"),
        "house_id" uuid REFERENCES "houses"("id"),
        "applicant_name" varchar NOT NULL,
        "applicant_contact" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      
      CREATE TABLE "reports" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" varchar NOT NULL,
        "user_id" uuid REFERENCES "users"("id"),
        "post_id" uuid REFERENCES "posts"("id"),
        "event_id" uuid REFERENCES "events"("id"),
        "type" varchar NOT NULL,
        "content" text NOT NULL,
        "created_at" timestamptz DEFAULT now(),
        "updated_at" timestamptz DEFAULT now(),
        "is_deleted" boolean DEFAULT false
      );
      
      CREATE INDEX idx_user_tenant ON "users"("tenant_id");
      CREATE INDEX idx_house_tenant ON "houses"("tenant_id");
      CREATE INDEX idx_post_tenant ON "posts"("tenant_id");
      CREATE INDEX idx_comment_tenant ON "comments"("tenant_id");
      CREATE INDEX idx_event_tenant ON "events"("tenant_id");
      CREATE INDEX idx_application_tenant ON "applications"("tenant_id");
      CREATE INDEX idx_report_tenant ON "reports"("tenant_id");
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DROP TABLE IF EXISTS "reports";
      DROP TABLE IF EXISTS "applications";
      DROP TABLE IF EXISTS "events";
      DROP TABLE IF EXISTS "comments";
      DROP TABLE IF EXISTS "posts";
      DROP TABLE IF EXISTS "users";
      DROP TABLE IF EXISTS "houses";
    `);
    }
}
exports.InitSchema1719300000000 = InitSchema1719300000000;
//# sourceMappingURL=InitSchema.js.map