"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const House_entity_1 = require("./House.entity");
let Application = class Application {
    id;
    tenant_id;
    user;
    house;
    applicant_name;
    applicant_contact;
    status;
    reason;
    created_at;
    updated_at;
    is_deleted;
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Application.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", User_entity_1.User)
], Application.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => House_entity_1.House),
    (0, typeorm_1.JoinColumn)({ name: 'house_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", House_entity_1.House)
], Application.prototype, "house", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '신청자 이름(암호화 저장)' }),
    __metadata("design:type", String)
], Application.prototype, "applicant_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '신청자 연락처(암호화 저장)' }),
    __metadata("design:type", String)
], Application.prototype, "applicant_contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: '거절 사유(선택)' }),
    __metadata("design:type", String)
], Application.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Application.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Application.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Application.prototype, "is_deleted", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)('applications'),
    (0, typeorm_1.Index)(['tenant_id', 'user', 'house', 'status', 'created_at'])
], Application);
//# sourceMappingURL=Application.entity.js.map