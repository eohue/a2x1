import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/Notification.entity';
import { User } from '../../entities/User.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject('SOCKET_IO_SERVER') private readonly io?: any,
  ) {}

  async getUserNotifications(userId: string) {
    return this.notificationRepo.find({
      where: { user: { id: userId }, is_deleted: false },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationRepo.findOne({ where: { id: notificationId, user: { id: userId } } });
    if (!notification) throw new Error('알림 없음');
    notification.is_read = true;
    await this.notificationRepo.save(notification);
    return notification;
  }

  async createNotification(userId: string, type: string, content: string, link?: string, meta?: Record<string, any>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    const notification = this.notificationRepo.create({
      tenant_id: user.tenant_id,
      user,
      type,
      content,
      link,
      meta,
      is_read: false,
    });
    const saved = await this.notificationRepo.save(notification);
    // Emit real-time event if io is available
    if (this.io) {
      this.io.to(userId).emit('notification:new', saved);
    }
    return saved;
  }
} 