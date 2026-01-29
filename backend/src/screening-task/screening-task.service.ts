import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseCrudService } from '../common/crud/base-crud.service';

@Injectable()
export class ScreeningTaskService extends BaseCrudService<Task> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {
    super(taskRepository, 'Task');
  }
  findAllV2(): Promise<Task[]> {
    return super.findAll();
  }

  findOneV2(id: string): Promise<Task> {
    return super.findOne(id);
  }

  createV2(createTaskDto: CreateTaskDto): Promise<Task> {
    return super.create(createTaskDto);
  }

  updateV2(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return super.update(id, updateTaskDto);
  }

  removeV2(id: string): Promise<void> {
    return super.removeSoft(id);
  }
}
