import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { Report } from '../../entities/Report.entity';
import { ReportHistory } from '../../entities/ReportHistory.entity';
import { User } from '../../entities/User.entity';
import { Request, Response } from 'express';
import { sendFcmNotification } from '@common/fcm';
import { NotificationService } from '../notification/notification.service';
import { Parser as CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Post } from '../../entities/Post.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(ReportHistory)
    private readonly historyRepo: Repository<ReportHistory>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly notificationService: NotificationService,
  ) {}

  async createReport(req: Request, dto: CreateReportDto) {
    // user 정보 추출 (JWT payload)
    const userId = (req as any).user?.id;
    if (!userId) throw new Error('인증 필요');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    const report = this.reportRepo.create({
      tenant_id: user.tenant_id,
      user,
      type: dto.type,
      content: dto.content,
      post: dto.post_id ? { id: dto.post_id } : undefined,
      event: dto.event_id ? { id: dto.event_id } : undefined,
      status: 'submitted',
    });
    const saved = await this.reportRepo.save(report);
    // 최초 이력 저장
    const history = this.historyRepo.create({
      report: saved,
      user,
      status: 'submitted',
      comment: '민원 접수',
    });
    await this.historyRepo.save(history);
    return saved;
  }

  async updateReportStatus(req: Request, id: string, dto: UpdateReportStatusDto) {
    const userId = (req as any).user?.id;
    if (!userId) throw new Error('인증 필요');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    const report = await this.reportRepo.findOne({ where: { id }, relations: ['user'] });
    if (!report) throw new Error('민원 없음');
    report.status = dto.status;
    await this.reportRepo.save(report);
    // 이력 저장
    const history = this.historyRepo.create({
      report,
      user,
      status: dto.status,
      comment: dto.comment,
    });
    await this.historyRepo.save(history);
    // FCM 알림 트리거 (상태 변경 시 신고자에게)
    if (report.user?.fcm_token) {
      try {
        await sendFcmNotification(
          report.user.fcm_token,
          '민원 상태 변경',
          `민원 상태가 '${dto.status}'로 변경되었습니다.`,
          { reportId: report.id, status: dto.status }
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('FCM 알림 발송 실패:', e);
      }
    }
    // Notification DB 알림 생성 (상태 변경 시 신고자에게)
    if (report.user?.id) {
      try {
        await this.notificationService.createNotification(
          report.user.id,
          'report',
          `민원(ID: ${report.id}) 상태가 '${dto.status}'로 변경되었습니다.`,
          `/resident/reports/${report.id}`,
          { reportId: report.id, status: dto.status }
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('DB 알림 생성 실패:', e);
      }
    }
    // FCM 알림 트리거 (상태 변경 시 관리자에게)
    try {
      // 관리자(운영자) 전체 조회 (중복 토큰 방지, 삭제/미등록 제외)
      const admins = await this.userRepo.find({
        where: [
          { role: 'admin', is_deleted: false },
          { role: 'manager', is_deleted: false },
          { role: 'super', is_deleted: false },
        ],
      });
      const adminTokens = Array.from(new Set(admins.map(a => a.fcm_token).filter(Boolean)));
      for (const token of adminTokens) {
        // 신고자와 중복 토큰은 제외
        if (token && token !== report.user?.fcm_token) {
          try {
            await sendFcmNotification(
              token,
              '민원 상태 변경',
              `민원(ID: ${report.id}) 상태가 '${dto.status}'로 변경되었습니다.`,
              { reportId: report.id, status: dto.status }
            );
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('FCM(관리자) 알림 발송 실패:', e);
          }
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('관리자 FCM 알림 처리 오류:', e);
    }
    return report;
  }

  async findAll(req: Request) {
    // (예시) 관리자: 전체, 사용자: 본인 민원만
    const userId = (req as any).user?.id;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    if (user.role === 'admin' || user.role === 'super') {
      return this.reportRepo.find({ relations: ['user', 'post', 'event'] });
    }
    return this.reportRepo.find({ where: { user: { id: userId } }, relations: ['user', 'post', 'event'] });
  }

  async findOne(req: Request, id: string) {
    const userId = (req as any).user?.id;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    const report = await this.reportRepo.findOne({ where: { id }, relations: ['user', 'post', 'event'] });
    if (!report) throw new Error('민원 없음');
    // 권한 체크(관리자 또는 본인)
    if (user.role !== 'admin' && user.role !== 'super' && report.user.id !== userId) {
      throw new Error('권한 없음');
    }
    return report;
  }

  async getHistory(req: Request, id: string) {
    // 민원 처리 이력 조회
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) throw new Error('민원 없음');
    return this.historyRepo.find({ where: { report: { id } }, relations: ['user'], order: { created_at: 'ASC' } });
  }

  async remove(req: Request, id: string) {
    const userId = (req as any).user?.id;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || (user.role !== 'admin' && user.role !== 'super')) {
      throw new Error('관리자 권한 필요');
    }
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) throw new Error('민원 없음');
    report.is_deleted = true;
    await this.reportRepo.save(report);
    return { success: true };
  }

  async export(req: Request, type: 'csv' | 'pdf' = 'csv') {
    const userId = (req as any).user?.id;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || (user.role !== 'admin' && user.role !== 'super')) {
      throw new Error('관리자 권한 필요');
    }
    const reports = await this.reportRepo.find({ where: { is_deleted: false }, relations: ['user', 'post', 'event'] });
    if (type === 'csv') {
      const fields = [
        { label: 'ID', value: 'id' },
        { label: '유저', value: row => row.user?.id || '' },
        { label: '유형', value: 'type' },
        { label: '내용', value: 'content' },
        { label: '상태', value: 'status' },
        { label: '생성일', value: row => row.created_at?.toISOString() || '' },
      ];
      const parser = new CsvParser({ fields });
      const csv = parser.parse(reports);
      return {
        buffer: Buffer.from(csv, 'utf-8'),
        filename: `reports_${Date.now()}.csv`,
        contentType: 'text/csv',
      };
    } else {
      // PDF 생성
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});
      doc.fontSize(16).text('리포트 목록', { align: 'center' });
      doc.moveDown();
      reports.forEach((r, i) => {
        doc.fontSize(10).text(`ID: ${r.id}`);
        doc.text(`유저: ${r.user?.id || ''}`);
        doc.text(`유형: ${r.type}`);
        doc.text(`내용: ${r.content}`);
        doc.text(`상태: ${r.status}`);
        doc.text(`생성일: ${r.created_at?.toISOString() || ''}`);
        doc.moveDown();
      });
      doc.end();
      const buffer = await new Promise<Buffer>(resolve => {
        const bufs: Buffer[] = [];
        doc.on('data', d => bufs.push(d));
        doc.on('end', () => resolve(Buffer.concat(bufs)));
      });
      return {
        buffer,
        filename: `reports_${Date.now()}.pdf`,
        contentType: 'application/pdf',
      };
    }
  }

  async getSummary(): Promise<{ mau: number, posts: number, reports: number }> {
    // MAU: 최근 30일간 Report 작성자 유니크 수
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const recentReports = await this.reportRepo
      .createQueryBuilder('report')
      .where('report.created_at >= :since', { since })
      .select(['report.user'])
      .leftJoin('report.user', 'user')
      .getMany();
    const mau = new Set(recentReports.map(r => r.user?.id).filter(Boolean)).size;
    // 전체 게시물 수
    const posts = await this.postRepo.count();
    // 전체 민원 수
    const reports = await this.reportRepo.count();
    return { mau, posts, reports };
  }
} 