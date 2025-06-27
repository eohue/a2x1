import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../../entities/Report.entity';
import { ReportHistory } from '../../entities/ReportHistory.entity';
import { User } from '../../entities/User.entity';
import { Post } from '../../entities/Post.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportHistory, User, Post]), NotificationModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {} 