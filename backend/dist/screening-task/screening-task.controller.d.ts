import { ScreeningTaskService } from './screening-task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class ScreeningTaskController {
    private readonly taskService;
    constructor(taskService: ScreeningTaskService);
    findAllV1(): import("./screening-task.service").TaskModel[];
    findOneV1(id: string): import("./screening-task.service").TaskModel;
    createV1(createTaskDto: CreateTaskDto): import("./screening-task.service").TaskModel;
    updateV1(id: string, updateTaskDto: UpdateTaskDto): import("./screening-task.service").TaskModel;
    removeV1(id: string): void;
    findAllV2(): Promise<import("./entities/task.entity").Task[]>;
    findOneV2(id: string): Promise<import("./entities/task.entity").Task>;
    createV2(createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
    createFrozenV2(createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
    updateV2(id: string, updateTaskDto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    removeV2(id: string): Promise<void>;
}
