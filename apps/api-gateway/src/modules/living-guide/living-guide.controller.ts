import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards, Delete } from '@nestjs/common';
import { LivingGuideService } from './living-guide.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('living-guide')
@UseGuards(JwtAuthGuard)
export class LivingGuideController {
  constructor(private readonly guideService: LivingGuideService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const tenantId = (req as any).user?.tenant_id;
    if (!tenantId) return { error: '테넌트 정보 필요' };
    return { data: await this.guideService.findAll(tenantId), error: null };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const tenantId = (req as any).user?.tenant_id;
    if (!tenantId) return { error: '테넌트 정보 필요' };
    return { data: await this.guideService.findOne(id, tenantId), error: null };
  }

  @Post()
  async create(@Req() req: Request, @Body() body: { title: string; content: string }) {
    const userId = (req as any).user?.id;
    const tenantId = (req as any).user?.tenant_id;
    if (!userId || !tenantId) return { error: '인증/테넌트 필요' };
    try {
      const data = await this.guideService.create(body.title, body.content, userId, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Req() req: Request, @Body() body: { content: string }) {
    const userId = (req as any).user?.id;
    const tenantId = (req as any).user?.tenant_id;
    if (!userId || !tenantId) return { error: '인증/테넌트 필요' };
    try {
      const data = await this.guideService.update(id, body.content, userId, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Patch(':id/submit')
  async submitForApproval(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.id;
    const tenantId = (req as any).user?.tenant_id;
    if (!userId || !tenantId) return { error: '인증/테넌트 필요' };
    try {
      const data = await this.guideService.submitForApproval(id, userId, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    if (!user || !['admin', 'super', 'manager'].includes(user.role)) return { error: '관리자 권한 필요' };
    const tenantId = user.tenant_id;
    try {
      const data = await this.guideService.approve(id, user.id, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    if (!user || !['admin', 'super', 'manager'].includes(user.role)) return { error: '관리자 권한 필요' };
    const tenantId = user.tenant_id;
    try {
      const data = await this.guideService.reject(id, user.id, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    if (!user || !['admin', 'super', 'manager'].includes(user.role)) return { error: '관리자 권한 필요' };
    const tenantId = user.tenant_id;
    try {
      const data = await this.guideService.getHistory(id, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Patch(':id/rollback/:version')
  async rollback(@Param('id') id: string, @Param('version') version: string, @Req() req: Request) {
    const user = (req as any).user;
    if (!user || !['admin', 'super', 'manager'].includes(user.role)) return { error: '관리자 권한 필요' };
    const tenantId = user.tenant_id;
    try {
      const data = await this.guideService.rollback(id, Number(version), user.id, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    if (!user || !['admin', 'super', 'manager'].includes(user.role)) return { error: '관리자 권한 필요' };
    const tenantId = user.tenant_id;
    try {
      const data = await this.guideService.remove(id, tenantId);
      return { data, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }
} 