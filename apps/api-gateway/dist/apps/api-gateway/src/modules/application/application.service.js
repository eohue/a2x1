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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Application_entity_1 = require("../../entities/Application.entity");
const crypto_1 = require("../../../../../libs/common/crypto");
let ApplicationService = class ApplicationService {
    applicationRepo;
    constructor(applicationRepo) {
        this.applicationRepo = applicationRepo;
    }
    async createApplication(data) {
        console.time('createApplication');
        const entity = this.applicationRepo.create({
            ...data,
            applicant_name: (0, crypto_1.encrypt)(data.applicant_name),
            applicant_contact: (0, crypto_1.encrypt)(data.applicant_contact),
        });
        const result = await this.applicationRepo.save(entity);
        console.timeEnd('createApplication');
        return result;
    }
    async getApplications() {
        console.time('getApplications');
        const apps = await this.applicationRepo.find();
        const result = apps.map(app => ({
            ...app,
            applicant_name: app.applicant_name ? (0, crypto_1.decrypt)(app.applicant_name) : '',
            applicant_contact: app.applicant_contact ? (0, crypto_1.decrypt)(app.applicant_contact) : '',
        }));
        console.timeEnd('getApplications');
        return result;
    }
    async getApplicationById(id) {
        console.time('getApplicationById');
        const app = await this.applicationRepo.findOne({ where: { id } });
        let result = undefined;
        if (app) {
            result = {
                ...app,
                applicant_name: app.applicant_name ? (0, crypto_1.decrypt)(app.applicant_name) : '',
                applicant_contact: app.applicant_contact ? (0, crypto_1.decrypt)(app.applicant_contact) : '',
            };
        }
        console.timeEnd('getApplicationById');
        return result;
    }
    async updateStatus(id, status, reason) {
        console.time('updateStatus');
        const app = await this.applicationRepo.findOne({ where: { id } });
        let result = undefined;
        if (app) {
            app.status = status;
            if (reason)
                app.reason = reason;
            result = await this.applicationRepo.save(app);
        }
        console.timeEnd('updateStatus');
        return result;
    }
    async getMyApplication(userId) {
        console.time('getMyApplication');
        const app = await this.applicationRepo.findOne({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
            relations: ['user'],
        });
        let result = undefined;
        if (app) {
            result = {
                ...app,
                applicant_name: app.applicant_name ? (0, crypto_1.decrypt)(app.applicant_name) : '',
                applicant_contact: app.applicant_contact ? (0, crypto_1.decrypt)(app.applicant_contact) : '',
            };
        }
        console.timeEnd('getMyApplication');
        return result;
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApplicationService);
//# sourceMappingURL=application.service.js.map