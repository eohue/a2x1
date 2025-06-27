import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../../entities/Poll.entity';
import { User } from '../../entities/User.entity';
import { Event } from '../../entities/Event.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepo: Repository<Poll>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @Inject('SOCKET_IO_SERVER') private readonly io?: any,
  ) {}

  async createPoll(userId: string, data: { title: string; description: string; options: { id: string; text: string }[]; eventId?: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    let event: Event | null = null;
    if (data.eventId) {
      event = await this.eventRepo.findOne({ where: { id: data.eventId } });
      if (!event) throw new Error('이벤트 없음');
    }
    const poll = this.pollRepo.create({
      tenant_id: user.tenant_id,
      created_by: user,
      ...(event ? { event } : {}),
      title: data.title,
      description: data.description,
      options: data.options,
      votes: [],
    });
    const saved = await this.pollRepo.save(poll);
    if (this.io) this.io.emit('poll:new', saved);
    return saved;
  }

  async vote(userId: string, pollId: string, optionId: string) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    if (!poll) throw new Error('투표 없음');
    if (poll.votes.some(v => v.userId === userId)) throw new Error('이미 투표함');
    poll.votes.push({ userId, optionId });
    const saved = await this.pollRepo.save(poll);
    if (this.io) this.io.emit('poll:vote', { pollId, userId, optionId });
    return saved;
  }

  async getResults(pollId: string) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    if (!poll) throw new Error('투표 없음');
    const results = poll.options.map(opt => ({
      optionId: opt.id,
      text: opt.text,
      votes: poll.votes.filter(v => v.optionId === opt.id).length,
    }));
    return { pollId, title: poll.title, results };
  }
} 