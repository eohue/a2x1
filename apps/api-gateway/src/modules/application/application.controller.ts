import { Controller, Post, Body, Get, Param, Patch, UsePipes, ValidationPipe, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from '../../entities/Application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@core/decorators/roles.decorator';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: { id: string };
}

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() body: CreateApplicationDto, @Req() req: AuthRequest) {
    // user_id, tenant_id를 인증 정보에서 추출
    const user_id = req.user?.id;
    const tenant_id = req.user?.tenant_id;
    try {
      return await this.applicationService.createApplication({ ...body, user_id, tenant_id });
    } catch (e: any) {
      throw new BadRequestException(e.message || '입주 신청 처리 중 오류가 발생했습니다.');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super')
  async findAll() {
    return this.applicationService.getApplications();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super')
  async findOne(@Param('id') id: string) {
    return this.applicationService.getApplicationById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, dto.status, dto.reason);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyApplication(@Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestException('인증 정보가 올바르지 않습니다.');
    }
    return this.applicationService.getMyApplication(req.user.id);
  }
} 