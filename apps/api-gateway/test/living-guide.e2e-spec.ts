import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('LivingGuide E2E', () => {
  let app: INestApplication;
  let httpServer: any;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let guideId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    httpServer = app.getHttpServer();
    dataSource = app.get(DataSource);
    // 테스트용 유저/관리자 생성 및 토큰 발급 (가정: /auth/register, /auth/login API 존재)
    await dataSource.query('DELETE FROM living_guide_history');
    await dataSource.query('DELETE FROM living_guide');
    await dataSource.query('DELETE FROM "user"');
    await request(httpServer).post('/auth/register').send({ email: 'user@a.com', password: '1234', name: 'User' });
    await request(httpServer).post('/auth/register').send({ email: 'admin@a.com', password: '1234', name: 'Admin', role: 'admin' });
    const userRes = await request(httpServer).post('/auth/login').send({ email: 'user@a.com', password: '1234' });
    const adminRes = await request(httpServer).post('/auth/login').send({ email: 'admin@a.com', password: '1234' });
    userToken = userRes.body.data?.accessToken;
    adminToken = adminRes.body.data?.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('입주민이 생활백서 문서를 생성한다', async () => {
    const res = await request(httpServer)
      .post('/living-guide')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: '테스트 문서', content: '초안' });
    expect(res.body.data).toBeDefined();
    expect(res.body.data.title).toBe('테스트 문서');
    guideId = res.body.data.id;
  });

  it('입주민이 문서를 수정한다', async () => {
    const res = await request(httpServer)
      .patch(`/living-guide/${guideId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: '수정된 내용' });
    expect(res.body.data.content).toBe('수정된 내용');
    expect(res.body.data.status).toBe('draft');
  });

  it('입주민이 문서를 승인 요청한다', async () => {
    const res = await request(httpServer)
      .patch(`/living-guide/${guideId}/submit`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.body.data.status).toBe('pending');
  });

  it('관리자가 문서를 승인한다', async () => {
    const res = await request(httpServer)
      .patch(`/living-guide/${guideId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data.status).toBe('approved');
    expect(res.body.data.approved_by).toBeDefined();
  });

  it('관리자가 이력 조회/롤백/삭제를 할 수 있다', async () => {
    // 이력 조회
    const historyRes = await request(httpServer)
      .get(`/living-guide/${guideId}/history`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(Array.isArray(historyRes.body.data)).toBe(true);
    // 롤백
    const rollbackRes = await request(httpServer)
      .patch(`/living-guide/${guideId}/rollback/1`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(rollbackRes.body.data.status).toBe('draft');
    // 삭제
    const delRes = await request(httpServer)
      .delete(`/living-guide/${guideId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.body.data.success).toBe(true);
  });

  it('권한 없는 사용자는 승인/반려/삭제/이력/롤백 불가', async () => {
    // 승인
    const approveRes = await request(httpServer)
      .patch(`/living-guide/${guideId}/approve`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(approveRes.body.error).toBeDefined();
    // 반려
    const rejectRes = await request(httpServer)
      .patch(`/living-guide/${guideId}/reject`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(rejectRes.body.error).toBeDefined();
    // 이력
    const historyRes = await request(httpServer)
      .get(`/living-guide/${guideId}/history`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(historyRes.body.error).toBeDefined();
    // 롤백
    const rollbackRes = await request(httpServer)
      .patch(`/living-guide/${guideId}/rollback/1`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(rollbackRes.body.error).toBeDefined();
    // 삭제
    const delRes = await request(httpServer)
      .delete(`/living-guide/${guideId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(delRes.body.error).toBeDefined();
  });

  it('없는 문서/이력/권한 등 예외 상황 처리', async () => {
    // 없는 문서 접근
    const res = await request(httpServer)
      .get('/living-guide/invalid-id')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data).toBeNull();
    // 없는 이력 롤백
    const rollbackRes = await request(httpServer)
      .patch('/living-guide/invalid-id/rollback/99')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(rollbackRes.body.data).toBeNull();
  });
}); 