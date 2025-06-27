import { Controller, Get, Query, Req } from '@nestjs/common';
import { ExternalService } from './external.service';
import { Request } from 'express';

@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Get('instagram/feed')
  async getInstagramFeed(@Query('limit') limit?: string) {
    return this.externalService.getInstagramFeed(Number(limit) || 9);
  }

  @Get('kakao/share')
  async getKakaoShare(@Query('url') url: string, @Req() req: Request) {
    return this.externalService.getKakaoShare(url, req);
  }
} 