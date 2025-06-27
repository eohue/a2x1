import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presign')
  async getPresignedUrl(@Body() body: { filename: string; contentType: string }) {
    // S3 버킷명은 환경변수에서 가져옴
    const bucket = process.env.AWS_S3_BUCKET!;
    // 파일명에 경로/uuid 등 추가 정책은 실제 서비스에 맞게 조정 가능
    const key = `attachments/${Date.now()}_${body.filename}`;
    const url = await this.uploadService.getPresignedUrl(bucket, key, body.contentType);
    return { url, key };
  }
} 