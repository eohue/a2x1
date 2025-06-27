import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityPreviewService } from './community-preview.service';
import { CommunityPreviewController } from './community-preview.controller';
import { Interview } from '../../entities/Interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  providers: [CommunityPreviewService],
  controllers: [CommunityPreviewController],
})
export class CommunityPreviewModule {} 