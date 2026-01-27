import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID, Min, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  poster?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'trailerUrl must be a valid URL (include http/https)' })
  @IsOptional()
  trailerUrl?: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  genreIds?: string[];
}
