import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// In-memory storage for v1
export interface TaskModel {
  id: string;
  name: string;
  description: string;
  date: Date | null;
  status: string;
}

@Injectable()
export class ScreeningTaskService {
  private tasksInMemory: TaskModel[] = [];
  private idCounter = 1;

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject('UUID') private readonly uuid: () => string,
  ) {}

  // V1: In-memory CRUD operations
  findAllV1(): TaskModel[] {
    return this.tasksInMemory;
  }

  findOneV1(id: string): TaskModel {
    const task = this.tasksInMemory.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createV1(createTaskDto: CreateTaskDto): TaskModel {
    const task: TaskModel = {
      id: this.uuid(),
      name: createTaskDto.name,
      description: createTaskDto.description || '',
      date: createTaskDto.date ? new Date(createTaskDto.date) : null,
      status: createTaskDto.status || 'En attente',
    };
    this.tasksInMemory.push(task);
    return task;
  }

  updateV1(id: string, updateTaskDto: UpdateTaskDto): TaskModel {
    const index = this.tasksInMemory.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    const updatedTask: TaskModel = { 
      ...this.tasksInMemory[index], 
      ...updateTaskDto,
      date: this.tasksInMemory[index].date
    };
    if (updateTaskDto.date) {
      updatedTask.date = new Date(updateTaskDto.date);
    }
    this.tasksInMemory[index] = updatedTask;
    return this.tasksInMemory[index];
  }

  removeV1(id: string): void {
    const index = this.tasksInMemory.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasksInMemory.splice(index, 1);
  }

  // V2: TypeORM CRUD operations
  async findAllV2(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOneV2(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createV2(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async updateV2(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOneV2(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async removeV2(id: string): Promise<void> {
    const task = await this.findOneV2(id);
    await this.taskRepository.softRemove(task);
  }
}
