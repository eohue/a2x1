import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsIn(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  reason?: string;
} 