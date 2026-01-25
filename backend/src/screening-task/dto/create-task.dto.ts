import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
