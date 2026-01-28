import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ReportCategory } from '../entities/report.entity';

export class CreateReportDto {
  @IsEnum(ReportCategory)
  category: ReportCategory;

  @IsString()
  @MinLength(10)
  message: string;

  @IsUUID()
  @IsOptional()
  movieId?: string;

  @IsUUID()
  @IsOptional()
  reviewId?: string;
}
