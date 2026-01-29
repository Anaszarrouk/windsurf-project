import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseCrudService } from '../common/crud/base-crud.service';
export declare class ScreeningTaskService extends BaseCrudService<Task> {
    private taskRepository;
    constructor(taskRepository: Repository<Task>);
    findAllV2(): Promise<Task[]>;
    findOneV2(id: string): Promise<Task>;
    createV2(createTaskDto: CreateTaskDto): Promise<Task>;
    updateV2(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    removeV2(id: string): Promise<void>;
}
