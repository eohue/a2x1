import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/Event.entity';
import { User } from '../../entities/User.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject('SOCKET_IO_SERVER') private readonly io?: any,
  ) {}

  async list() {
    return this.eventRepo.find({ relations: ['participants', 'created_by'], order: { start_at: 'DESC' } });
  }

  async findOne(id: string) {
    return this.eventRepo.findOne({ where: { id }, relations: ['participants', 'created_by'] });
  }

  async create(userId: string, data: { title: string; description: string; start_at: string; end_at: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    const event = this.eventRepo.create({
      ...data,
      created_by: user,
      participants: [user],
      start_at: new Date(data.start_at),
      end_at: new Date(data.end_at),
      tenant_id: user.tenant_id,
    });
    const saved = await this.eventRepo.save(event);
    if (this.io) this.io.emit('event:new', saved);
    return saved;
  }

  async join(userId: string, eventId: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId }, relations: ['participants'] });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!event || !user) throw new Error('이벤트/사용자 없음');
    if (!event.participants.some(u => u.id === userId)) {
      event.participants.push(user);
      await this.eventRepo.save(event);
      if (this.io) this.io.emit('event:joined', { eventId, user });
    }
    return event;
  }
} 