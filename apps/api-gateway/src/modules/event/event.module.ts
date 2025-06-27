import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../entities/Event.entity';
import { User } from '../../entities/User.entity';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User]), forwardRef(() => NotificationModule)],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {} 