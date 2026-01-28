"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
let ScreeningTaskService = class ScreeningTaskService {
    constructor(taskRepository, uuid) {
        this.taskRepository = taskRepository;
        this.uuid = uuid;
        this.tasksInMemory = [];
        this.idCounter = 1;
    }
    findAllV1() {
        return this.tasksInMemory;
    }
    findOneV1(id) {
        const task = this.tasksInMemory.find((t) => t.id === id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    createV1(createTaskDto) {
        const task = {
            id: this.uuid(),
            name: createTaskDto.name,
            description: createTaskDto.description || '',
            date: createTaskDto.date ? new Date(createTaskDto.date) : null,
            status: createTaskDto.status || 'En attente',
            screeningId: createTaskDto.screeningId,
        };
        this.tasksInMemory.push(task);
        return task;
    }
    updateV1(id, updateTaskDto) {
        const index = this.tasksInMemory.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        const updatedTask = {
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
    removeV1(id) {
        const index = this.tasksInMemory.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        this.tasksInMemory.splice(index, 1);
    }
    async findAllV2() {
        return this.taskRepository.find();
    }
    async findOneV2(id) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    async createV2(createTaskDto) {
        const task = this.taskRepository.create(createTaskDto);
        return this.taskRepository.save(task);
    }
    async updateV2(id, updateTaskDto) {
        const task = await this.findOneV2(id);
        Object.assign(task, updateTaskDto);
        return this.taskRepository.save(task);
    }
    async removeV2(id) {
        const task = await this.findOneV2(id);
        await this.taskRepository.softRemove(task);
    }
};
exports.ScreeningTaskService = ScreeningTaskService;
exports.ScreeningTaskService = ScreeningTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, common_1.Inject)('UUID')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Function])
], ScreeningTaskService);
//# sourceMappingURL=screening-task.service.js.map