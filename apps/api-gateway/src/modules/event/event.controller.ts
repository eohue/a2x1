import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async list() {
    try {
      const data = await this.eventService.list();
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.eventService.findOne(id);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Post()
  async create(@Req() req: Request, @Body() body: { title: string; description: string; start_at: string; end_at: string }) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요' };
    try {
      const data = await this.eventService.create(userId, body);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Post(':id/join')
  async join(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요' };
    try {
      const data = await this.eventService.join(userId, id);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }
} 