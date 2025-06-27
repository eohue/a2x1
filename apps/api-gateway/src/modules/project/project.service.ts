import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/Project.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly uploadService: UploadService,
  ) {}

  async findById(id: string) {
    return this.projectRepo.findOne({ where: { id, is_deleted: false } });
  }

  async create(data: Partial<Project>) {
    const project = this.projectRepo.create(data);
    return this.projectRepo.save(project);
  }

  async update(id: string, data: Partial<Project>) {
    await this.projectRepo.update(id, data);
    return this.findById(id);
  }

  async updatePdfUrl(id: string, pdf_url: string) {
    await this.projectRepo.update(id, { pdf_url });
    return this.findById(id);
  }

  async list() {
    return this.projectRepo.find({ where: { is_deleted: false }, order: { created_at: 'DESC' } });
  }

  // PDF 업로드용 S3 Presigned URL 발급
  async uploadPdfPresign(projectId: string, filename: string, contentType: string) {
    if (!filename.endsWith('.pdf') || contentType !== 'application/pdf') {
      throw new Error('PDF 파일만 업로드할 수 있습니다.');
    }
    const bucket = process.env.AWS_S3_BUCKET!;
    const key = `project-pdf/${projectId}_${Date.now()}_${filename}`;
    const url = await this.uploadService.getPresignedUrl(bucket, key, contentType);
    return { url, key };
  }

  // 업로드 후 S3 URL을 DB에 저장
  async savePdfUrl(projectId: string, s3Key: string) {
    const bucket = process.env.AWS_S3_BUCKET!;
    const pdf_url = `https://${bucket}.s3.amazonaws.com/${s3Key}`;
    await this.projectRepo.update(projectId, { pdf_url });
    return this.findById(projectId);
  }
} 