import { Controller, Post, Body, Patch, Param, Get, UseGuards, Req, Delete, Query, Res } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ForbiddenException } from '@nestjs/common';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() dto: CreateReportDto) {
    try {
      const data = await this.reportService.createReport(req, dto);
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    try {
      const data = await this.reportService.updateReportStatus(req, id, dto);
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    try {
      const data = await this.reportService.findAll(req);
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    try {
      const data = await this.reportService.findOne(req, id);
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Get(':id/history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: Request, @Param('id') id: string) {
    try {
      const data = await this.reportService.getHistory(req, id);
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    try {
      const data = await this.reportService.remove(req, id);
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async export(
    @Req() req: Request,
    @Query('type') type: 'csv' | 'pdf' = 'csv',
    @Res() res: Response
  ) {
    try {
      const { buffer, filename, contentType } = await this.reportService.export(req, type);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ data: null, error: error.message || String(error), meta: null });
    }
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getSummary(@Req() req: Request) {
    try {
      const user = (req as any).user;
      if (!user || (user.role !== 'admin' && user.role !== 'super')) {
        throw new ForbiddenException('관리자 권한 필요');
      }
      const data = await this.reportService.getSummary();
      return { data, error: null, meta: null };
    } catch (error) {
      return { data: null, error: error.message || String(error), meta: null };
    }
  }
} 