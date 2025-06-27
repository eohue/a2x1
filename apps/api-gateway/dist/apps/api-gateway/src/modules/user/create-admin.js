"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../../entities/User.entity");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'ibookee',
    entities: [User_entity_1.User],
    synchronize: false,
});
async function createAdmin() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User_entity_1.User);
    const email = 'admin@ibookee.com';
    const name = '관리자';
    const plainPassword = 'ibookee123!';
    const password = await bcrypt.hash(plainPassword, 10);
    const tenant_id = 'ibookee';
    const role = 'super';
    const exists = await repo.findOne({ where: { email, tenant_id } });
    if (exists) {
        console.log('이미 존재하는 관리자 계정:', email);
        process.exit(0);
    }
    const user = repo.create({
        email,
        name,
        password,
        tenant_id,
        role,
        phone: '',
        is_deleted: false,
    });
    await repo.save(user);
    console.log('관리자 계정 생성 완료:', { email, password: plainPassword });
    process.exit(0);
}
createAdmin();
//# sourceMappingURL=create-admin.js.map