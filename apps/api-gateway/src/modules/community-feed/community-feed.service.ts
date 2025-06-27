import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/Post.entity';
import { User } from '../../entities/User.entity';

@Injectable()
export class CommunityFeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getFeed() {
    return this.postRepo.find({
      where: { is_deleted: false },
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async createPost(userId: string, content: string, channel: string, imageUrl?: string, videoUrl?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자 없음');
    const post = this.postRepo.create({
      tenant_id: user.tenant_id,
      user,
      house: undefined, // TODO: 소속 하우스 연동 필요시
      title: '',
      content,
      channel,
      image_url: imageUrl,
      video_url: videoUrl,
      is_deleted: false,
    });
    return this.postRepo.save(post);
  }
} 