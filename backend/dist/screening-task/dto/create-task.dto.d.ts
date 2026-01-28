import { TaskStatus } from '../entities/task.entity';
export declare class CreateTaskDto {
    name: string;
    description?: string;
    date?: string;
    status?: TaskStatus;
    screeningId?: string;
}
