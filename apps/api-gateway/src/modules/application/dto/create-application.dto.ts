import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  applicant_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(7, 20)
  applicant_contact: string;

  @IsNotEmpty()
  @IsUUID()
  house_id: string;

  @IsString()
  message?: string;
} 