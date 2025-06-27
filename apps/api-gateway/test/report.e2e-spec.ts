import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// 테스트용 JWT 토큰/유저 정보는 실제 환경에 맞게 교체 필요
const USER_TOKEN = 'test-user-jwt';
const ADMIN_TOKEN = 'test-admin-jwt';

describe('Report API (e2e)', () => {
  let app: INestApplication;
  let reportId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('민원 등록', async () => {
    const res = await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${USER_TOKEN}`)
      .send({ type: 'complaint', content: '테스트 민원' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    reportId = res.body.id;
  });

  it('민원 목록 조회', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports')
      .set('Authorization', `Bearer ${USER_TOKEN}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('민원 상세 조회', async () => {
    const res = await request(app.getHttpServer())
      .get(`/reports/${reportId}`)
      .set('Authorization', `Bearer ${USER_TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', reportId);
  });

  it('민원 상태 변경(관리자)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/reports/${reportId}/status`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({ status: 'resolved', comment: '처리 완료' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'resolved');
  });

  it('민원 이력 조회', async () => {
    const res = await request(app.getHttpServer())
      .get(`/reports/${reportId}/history`)
      .set('Authorization', `Bearer ${USER_TOKEN}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((h: any) => h.status === 'resolved')).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
}); 