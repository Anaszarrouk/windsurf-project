import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// Exercise 3.1: Use PartialType for Update DTOs
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
