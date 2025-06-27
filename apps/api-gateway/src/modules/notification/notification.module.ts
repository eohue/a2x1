import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../entities/Notification.entity';
import { User } from '../../entities/User.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  providers: [
    NotificationService,
    {
      provide: 'SOCKET_IO_SERVER',
      useFactory: () => {
        // Will be set at runtime in main.ts
        return (global as any).io || undefined;
      },
    },
  ],
  controllers: [NotificationController],
  exports: [NotificationService, 'SOCKET_IO_SERVER'],
})
export class NotificationModule {} 