import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ReportModule } from './modules/report/report.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PostModule } from './modules/post/post.module';
import { ExternalModule } from './modules/external/external.module';
import { User } from './entities/User.entity';
import { Report } from './entities/Report.entity';
import { Post } from './entities/Post.entity';
import { Application } from './entities/Application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivingGuideModule } from './modules/living-guide/living-guide.module';
import { PollModule } from './modules/poll/poll.module';
import { TenantModule } from './modules/tenant/tenant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'test',
      password: process.env.DB_PASS || 'test',
      database: process.env.DB_NAME || 'test_db',
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      synchronize: true,
    }),
    AuthModule,
    ReportModule,
    UploadModule,
    NotificationModule,
    DashboardModule,
    PostModule,
    ExternalModule,
    TypeOrmModule.forFeature([User, Report, Post, Application]),
    LivingGuideModule,
    PollModule,
    TenantModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
