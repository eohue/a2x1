import { Controller, Post, Body, UseGuards, Req, Get, Query, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../entities/User.entity';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const ALLOWED_STATUS = ['pending', 'approved', 'rejected', 'expelled'] as const;
type UserStatus = typeof ALLOWED_STATUS[number];
const ALLOWED_ROLE = ['resident', 'admin', 'manager', 'super'] as const;
type UserRole = typeof ALLOWED_ROLE[number];

@Controller('users')
export class UserController {
  @Post('fcm-token')
  @UseGuards(JwtAuthGuard)
  async saveFcmToken(@Req() req: AuthRequest, @Body() body: { token: string }) {
    const userId = req.user?.id;
    if (!userId) return { error: '인증 필요' };
    const repo = getRepository(User);
    const user = await repo.findOne({ where: { id: userId } });
    if (!user) return { error: '사용자 없음' };
    user.fcm_token = body.token;
    await repo.save(user);
    return { success: true };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: AuthRequest, @Query('q') q?: string, @Query('status') status?: string, @Query('role') role?: string) {
    if (!req.user || !['admin', 'super', 'manager'].includes(req.user.role)) return { error: '권한 없음' };
    const repo = getRepository(User);
    const where: any = { is_deleted: false };
    if (q) where.name = q; // TODO: like 검색 개선
    if (status) where.status = status;
    if (role) where.role = role;
    const users = await repo.find({ where });
    return { data: users };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: { status: string }) {
    if (!req.user || !['admin', 'super', 'manager'].includes(req.user.role)) return { error: '권한 없음' };
    if (!ALLOWED_STATUS.includes(body.status as UserStatus)) return { error: '허용되지 않은 상태' };
    const repo = getRepository(User);
    const user = await repo.findOne({ where: { id } });
    if (!user) return { error: '사용자 없음' };
    user.status = body.status as UserStatus;
    await repo.save(user);
    return { success: true };
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard)
  async updateRole(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: { role: string }) {
    if (!req.user || !['admin', 'super'].includes(req.user.role)) return { error: '권한 없음' };
    if (!ALLOWED_ROLE.includes(body.role as UserRole)) return { error: '허용되지 않은 권한' };
    const repo = getRepository(User);
    const user = await repo.findOne({ where: { id } });
    if (!user) return { error: '사용자 없음' };
    user.role = body.role as UserRole;
    await repo.save(user);
    return { success: true };
  }

  @Patch(':id/expel')
  @UseGuards(JwtAuthGuard)
  async expel(@Req() req: AuthRequest, @Param('id') id: string) {
    if (!req.user || !['admin', 'super', 'manager'].includes(req.user.role)) return { error: '권한 없음' };
    const repo = getRepository(User);
    const user = await repo.findOne({ where: { id } });
    if (!user) return { error: '사용자 없음' };
    user.status = 'expelled';
    user.is_deleted = true;
    await repo.save(user);
    return { success: true };
  }
} 