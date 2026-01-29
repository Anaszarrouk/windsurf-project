import { ScreeningTaskService } from './screening-task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseCrudController } from '../common/crud/base-crud.controller';
import { Task } from './entities/task.entity';
export declare class ScreeningTaskController extends BaseCrudController<Task, CreateTaskDto, UpdateTaskDto> {
    private readonly taskService;
    constructor(taskService: ScreeningTaskService);
    findAll(): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<void>;
}
