import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateReportStatusDto {
  @IsIn(['submitted', 'in_progress', 'resolved', 'rejected'])
  status: 'submitted' | 'in_progress' | 'resolved' | 'rejected';

  @IsOptional()
  @IsString()
  comment?: string;
} 