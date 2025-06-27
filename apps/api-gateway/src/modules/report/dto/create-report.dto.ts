import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  post_id?: string;

  @IsOptional()
  @IsUUID()
  event_id?: string;
} 