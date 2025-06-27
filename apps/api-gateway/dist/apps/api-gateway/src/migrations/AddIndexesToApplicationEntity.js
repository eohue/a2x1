"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexesToApplicationEntity = void 0;
class AddIndexesToApplicationEntity {
    name = 'AddIndexesToApplicationEntity';
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_tenant_id" ON "applications" ("tenant_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_user_id" ON "applications" ("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_house_id" ON "applications" ("house_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_status" ON "applications" ("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_created_at" ON "applications" ("created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_application_composite" ON "applications" ("tenant_id", "user_id", "house_id", "status", "created_at")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_composite"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_house_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_application_tenant_id"`);
    }
}
exports.AddIndexesToApplicationEntity = AddIndexesToApplicationEntity;
//# sourceMappingURL=AddIndexesToApplicationEntity.js.map