import { IsString, IsOptional, Length } from 'class-validator';

/**
 * 소모임(그룹) 생성 DTO
 */
export class CreateGroupDto {
  @IsString()
  @Length(2, 32)
  /** 그룹명 */
  name: string;

  @IsOptional()
  @IsString()
  /** 설명 */
  description?: string;

  @IsOptional()
  @IsString()
  /** 썸네일 URL */
  thumbnail_url?: string;
} 