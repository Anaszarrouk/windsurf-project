import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export interface TaskModel {
    id: string;
    name: string;
    description: string;
    date: Date | null;
    status: string;
}
export declare class ScreeningTaskService {
    private taskRepository;
    private readonly uuid;
    private tasksInMemory;
    private idCounter;
    constructor(taskRepository: Repository<Task>, uuid: () => string);
    findAllV1(): TaskModel[];
    findOneV1(id: string): TaskModel;
    createV1(createTaskDto: CreateTaskDto): TaskModel;
    updateV1(id: string, updateTaskDto: UpdateTaskDto): TaskModel;
    removeV1(id: string): void;
    findAllV2(): Promise<Task[]>;
    findOneV2(id: string): Promise<Task>;
    createV2(createTaskDto: CreateTaskDto): Promise<Task>;
    updateV2(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    removeV2(id: string): Promise<void>;
}
