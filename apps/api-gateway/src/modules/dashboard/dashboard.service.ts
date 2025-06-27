import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../../entities/User.entity';
import { Report } from '../../entities/Report.entity';
import { Post } from '../../entities/Post.entity';
import { Application } from '../../entities/Application.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  async getSummary() {
    // 회원 통계
    const totalUsers = await this.userRepo.count({ where: { is_deleted: false } });
    // 활성도: User 엔티티에 last_login_at, status 필드 없음 → 0으로 반환
    const dau = 0;
    const mau = 0;
    // 민원 통계
    const totalReports = await this.reportRepo.count();
    const pendingReports = await this.reportRepo.count({ where: { status: 'submitted' } });
    // 콘텐츠 통계(게시물)
    const totalPosts = await this.postRepo.count({ where: { is_deleted: false } });
    // 입주 신청 통계
    const totalApplications = await this.applicationRepo.count();
    const pendingApplications = await this.applicationRepo.count({ where: { status: 'pending' } });
    return {
      users: { total: totalUsers, dau, mau },
      reports: { total: totalReports, pending: pendingReports },
      posts: { total: totalPosts },
      applications: { total: totalApplications, pending: pendingApplications },
    };
  }
} 