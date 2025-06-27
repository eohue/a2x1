import { Controller, Get, Post, Patch, Param, Body, Query, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list() {
    return this.projectService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.projectService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.projectService.update(id, body);
  }

  // PDF 업로드 presign URL 발급 (관리자만)
  @Post(':id/upload-pdf/presign')
  async uploadPdfPresign(@Param('id') id: string, @Body() body: { filename: string; contentType: string }, @Req() req: any) {
    // TODO: 관리자 권한 체크
    if (req.user?.role !== 'admin' && req.user?.role !== 'super' && req.user?.role !== 'manager') {
      throw new ForbiddenException('관리자만 업로드할 수 있습니다.');
    }
    return this.projectService.uploadPdfPresign(id, body.filename, body.contentType);
  }

  // PDF 업로드 후 DB에 S3 URL 저장 (관리자만)
  @Post(':id/upload-pdf/commit')
  async uploadPdfCommit(@Param('id') id: string, @Body() body: { s3Key: string }, @Req() req: any) {
    // TODO: 관리자 권한 체크
    if (req.user?.role !== 'admin' && req.user?.role !== 'super' && req.user?.role !== 'manager') {
      throw new ForbiddenException('관리자만 업로드할 수 있습니다.');
    }
    return this.projectService.savePdfUrl(id, body.s3Key);
  }

  // PDF 다운로드 presign URL 발급 (권한 체크)
  @Get(':id/download-pdf')
  async downloadPdf(@Param('id') id: string, @Req() req: any) {
    const project = await this.projectService.findById(id);
    if (!project?.pdf_url) throw new ForbiddenException('PDF가 등록되어 있지 않습니다.');
    const user = req.user;
    // 권한 체크
    if (
      user?.role === 'admin' ||
      user?.role === 'super' ||
      user?.role === 'manager' ||
      (user?.role === 'resident' && user.tenant_id === project.tenant_id)
    ) {
      const bucket = process.env.AWS_S3_BUCKET!;
      const s3Key = project.pdf_url.split(`https://${bucket}.s3.amazonaws.com/`)[1];
      const url = await this.projectService.uploadService.getPresignedUrl(bucket, s3Key, 'application/pdf');
      return { url };
    }
    throw new ForbiddenException('해당 프로젝트에 접근할 권한이 없습니다.');
  }
} 