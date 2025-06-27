import { Controller, Get, Post as HttpPost, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async list(@Req() req: Request, @Query('q') q?: string, @Query('status') status?: string, @Query('channel') channel?: string) {
    return this.postService.list(req, q, status, channel);
  }

  @HttpPost()
  async create(@Req() req: Request, @Body() body: any) {
    return this.postService.create(req, body);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: any) {
    return this.postService.update(req, id, body);
  }

  @Patch(':id/status')
  async updateStatus(@Req() req: Request, @Param('id') id: string, @Body() body: { status: string }) {
    return this.postService.updateStatus(req, id, body.status);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this.postService.remove(req, id);
  }
} 