import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  poster?: string;

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
