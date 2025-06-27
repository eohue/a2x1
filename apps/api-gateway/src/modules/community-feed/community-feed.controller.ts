import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CommunityFeedService } from './community-feed.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('community/feed')
@UseGuards(JwtAuthGuard)
export class CommunityFeedController {
  constructor(private readonly feedService: CommunityFeedService) {}

  @Get()
  async getFeed() {
    try {
      const data = await this.feedService.getFeed();
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Post()
  async createPost(
    @Req() req: Request,
    @Body() body: { content: string; channel: string; image_url?: string; video_url?: string }
  ) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요', meta: null };
    try {
      const data = await this.feedService.createPost(
        userId,
        body.content,
        body.channel,
        body.image_url,
        body.video_url
      );
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }
} 