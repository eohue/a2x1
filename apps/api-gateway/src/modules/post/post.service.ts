import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Post } from '../../entities/Post.entity';
import { User } from '../../entities/User.entity';
import { Request } from 'express';

const ALLOWED_STATUS = ['pending', 'approved', 'rejected', 'deleted'] as const;
type PostStatus = typeof ALLOWED_STATUS[number];

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private async isAdmin(req: Request) {
    const userId = (req as any).user?.id;
    if (!userId) return false;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user && ['admin', 'super', 'manager'].includes(user.role);
  }

  async list(req: Request, q?: string, status?: string, channel?: string) {
    if (!(await this.isAdmin(req))) return { error: '권한 없음' };
    const where: any = { is_deleted: false };
    if (q) where.content = ILike(`%${q}%`);
    if (status) where.status = status;
    if (channel) where.channel = channel;
    const posts = await this.postRepo.find({ where, order: { created_at: 'DESC' } });
    return { data: posts };
  }

  async create(req: Request, body: any) {
    if (!(await this.isAdmin(req))) return { error: '권한 없음' };
    const userId = (req as any).user?.id;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return { error: '사용자 없음' };
    const post = this.postRepo.create({ ...body, user, status: body.status ?? 'approved', is_deleted: false });
    await this.postRepo.save(post);
    return { data: post };
  }

  async update(req: Request, id: string, body: any) {
    if (!(await this.isAdmin(req))) return { error: '권한 없음' };
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return { error: '게시물 없음' };
    Object.assign(post, body);
    await this.postRepo.save(post);
    return { data: post };
  }

  async updateStatus(req: Request, id: string, status: string) {
    if (!(await this.isAdmin(req))) return { error: '권한 없음' };
    if (!ALLOWED_STATUS.includes(status as PostStatus)) return { error: '허용되지 않은 상태' };
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return { error: '게시물 없음' };
    post.status = status as PostStatus;
    await this.postRepo.save(post);
    return { data: post };
  }

  async remove(req: Request, id: string) {
    if (!(await this.isAdmin(req))) return { error: '권한 없음' };
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return { error: '게시물 없음' };
    post.is_deleted = true;
    post.status = 'deleted';
    await this.postRepo.save(post);
    return { success: true };
  }
} 