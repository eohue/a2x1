import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// 테스트용 JWT 토큰/유저 정보는 실제 환경에 맞게 교체 필요
const ADMIN_TOKEN = 'test-admin-jwt';
const RESIDENT_TOKEN = 'test-resident-jwt';
const OTHER_TOKEN = 'test-other-jwt';

// 프로젝트 ID, 테넌트 ID 등은 실제 테스트 환경에 맞게 세팅 필요
const TEST_PROJECT_ID = 'test-project-id';
const TEST_FILENAME = 'test.pdf';
const TEST_CONTENT_TYPE = 'application/pdf';

// S3 Presigned URL로 실제 업로드는 mocking 또는 skip (URL 반환까지만 검증)

describe('Project PDF Upload/Download API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('관리자: PDF 업로드 presign URL 발급 성공', async () => {
    const res = await request(app.getHttpServer())
      .post(`/projects/${TEST_PROJECT_ID}/upload-pdf/presign`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({ filename: TEST_FILENAME, contentType: TEST_CONTENT_TYPE });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('key');
  });

  it('입주민: PDF 업로드 presign URL 발급 실패(권한 없음)', async () => {
    const res = await request(app.getHttpServer())
      .post(`/projects/${TEST_PROJECT_ID}/upload-pdf/presign`)
      .set('Authorization', `Bearer ${RESIDENT_TOKEN}`)
      .send({ filename: TEST_FILENAME, contentType: TEST_CONTENT_TYPE });
    expect(res.status).toBe(403);
  });

  it('관리자: PDF 업로드 commit 성공', async () => {
    const res = await request(app.getHttpServer())
      .post(`/projects/${TEST_PROJECT_ID}/upload-pdf/commit`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({ s3Key: 'project-pdf/test-key.pdf' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('pdf_url');
  });

  it('입주민: PDF 다운로드 presign URL 발급 성공(본인 테넌트)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${TEST_PROJECT_ID}/download-pdf`)
      .set('Authorization', `Bearer ${RESIDENT_TOKEN}`);
    // 실제 presign URL 반환 또는 200 OK
    expect([200, 201]).toContain(res.status);
    // presign url 또는 redirect 등 정책에 따라 검증
  });

  it('타 테넌트 입주민: PDF 다운로드 presign URL 발급 실패(권한 없음)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${TEST_PROJECT_ID}/download-pdf`)
      .set('Authorization', `Bearer ${OTHER_TOKEN}`);
    expect(res.status).toBe(403);
  });

  it('PDF 미등록 프로젝트: 다운로드 presign URL 발급 실패', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/nonexistent/download-pdf`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);
    expect(res.status).toBe(403);
  });

  afterAll(async () => {
    await app.close();
  });
}); 