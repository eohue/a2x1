import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivingGuide } from '../../entities/LivingGuide.entity';
import { User } from '../../entities/User.entity';
import { LivingGuideHistory } from '../../entities/LivingGuideHistory.entity';
import { LivingGuideService } from './living-guide.service';
import { LivingGuideController } from './living-guide.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LivingGuide, User, LivingGuideHistory])],
  providers: [LivingGuideService],
  controllers: [LivingGuideController],
})
export class LivingGuideModule {} 