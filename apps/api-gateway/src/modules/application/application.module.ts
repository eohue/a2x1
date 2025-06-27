import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../../entities/Application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { User } from '../../entities/User.entity';
import { House } from '../../entities/House.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, User, House])],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {} 