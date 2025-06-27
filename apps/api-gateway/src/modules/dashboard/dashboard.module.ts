import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../../entities/User.entity';
import { Report } from '../../entities/Report.entity';
import { Post } from '../../entities/Post.entity';
import { Application } from '../../entities/Application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Report, Post, Application])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 