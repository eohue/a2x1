import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: Partial<User>) {
    const user = this.userRepo.create({ ...data, isApproved: false });
    return this.userRepo.save(user);
  }

  async approve(userId: string) {
    return this.userRepo.update(userId, { isApproved: true });
  }
} 