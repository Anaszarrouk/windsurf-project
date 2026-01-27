import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ScreeningStatus } from '../entities/screening.entity';

export class CreateScreeningDto {
  @IsUUID()
  @IsNotEmpty()
  movieId: string;

  @IsDateString()
  @IsNotEmpty()
  startsAt: string;

  @IsDateString()
  @IsNotEmpty()
  endsAt: string;

  @IsString()
  @IsOptional()
  room?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  ticketsSold?: number;

  @IsEnum(ScreeningStatus)
  @IsOptional()
  status?: ScreeningStatus;
}
