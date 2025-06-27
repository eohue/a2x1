import { Controller, Post, Body, Param, Get, Req, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('polls')
@UseGuards(JwtAuthGuard)
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: { title: string; description: string; options: { id: string; text: string }[]; eventId?: string }) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요' };
    try {
      const data = await this.pollService.createPoll(userId, body);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Post(':id/vote')
  async vote(@Req() req: Request, @Param('id') id: string, @Body() body: { optionId: string }) {
    const userId = (req as any).user?.id;
    if (!userId) return { data: null, error: '인증 필요' };
    try {
      const data = await this.pollService.vote(userId, id, body.optionId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Get(':id/results')
  async getResults(@Param('id') id: string) {
    try {
      const data = await this.pollService.getResults(id);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }
} 