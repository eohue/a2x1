import { Controller, Get } from '@nestjs/common';
import { CommunityPreviewService } from './community-preview.service';

@Controller('community-preview')
export class CommunityPreviewController {
  constructor(private readonly service: CommunityPreviewService) {}

  @Get('instagram')
  async getInstagramFeed() {
    try {
      const data = await this.service.getInstagramFeed();
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Get('interviews')
  async getInterviews() {
    try {
      const data = await this.service.getInterviews();
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }
} 