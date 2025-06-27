import { Controller, Get, Patch, Param, UseGuards, Req, Post, Body, ForbiddenException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('me')
  async getMyNotifications(@Req() req: Request) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요', meta: null };
    try {
      const data = await this.notificationService.getUserNotifications(userId);
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요', meta: null };
    try {
      const data = await this.notificationService.markAsRead(id, userId);
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Post()
  async createNotification(@Req() req: Request, @Body() body: { userId: string; type: string; content: string; link?: string; meta?: any }) {
    const user = (req as any).user;
    if (!user || !['admin', 'super', 'manager'].includes(user.role)) {
      throw new ForbiddenException('관리자 권한 필요');
    }
    try {
      const data = await this.notificationService.createNotification(
        body.userId,
        body.type,
        body.content,
        body.link,
        body.meta
      );
      return { data, error: null, meta: null };
    } catch (error: any) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }
} 