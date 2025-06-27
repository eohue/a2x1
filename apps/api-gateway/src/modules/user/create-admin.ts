import { DataSource } from 'typeorm';
import { User } from '../../entities/User.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'ibookee',
  entities: [User],
  synchronize: false,
});

async function createAdmin() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
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