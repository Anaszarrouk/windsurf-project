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
exports.ScreeningTaskController = void 0;
const common_1 = require("@nestjs/common");
const screening_task_service_1 = require("./screening-task.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const user_entity_1 = require("../auth/entities/user.entity");
const freeze_pipe_1 = require("../common/pipes/freeze.pipe");
let ScreeningTaskController = class ScreeningTaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    findAllV1() {
        return this.taskService.findAllV1();
    }
    findOneV1(id) {
        return this.taskService.findOneV1(id);
    }
    createV1(createTaskDto) {
        return this.taskService.createV1(createTaskDto);
    }
    updateV1(id, updateTaskDto) {
        return this.taskService.updateV1(id, updateTaskDto);
    }
    removeV1(id) {
        return this.taskService.removeV1(id);
    }
    findAllV2() {
        return this.taskService.findAllV2();
    }
    findOneV2(id) {
        return this.taskService.findOneV2(id);
    }
    createV2(createTaskDto) {
        return this.taskService.createV2(createTaskDto);
    }
    createFrozenV2(createTaskDto) {
        return this.taskService.createV2(createTaskDto);
    }
    updateV2(id, updateTaskDto) {
        return this.taskService.updateV2(id, updateTaskDto);
    }
    removeV2(id) {
        return this.taskService.removeV2(id);
    }
};
exports.ScreeningTaskController = ScreeningTaskController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "findAllV1", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "findOneV1", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "createV1", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "updateV1", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "removeV1", null);
__decorate([
    (0, common_1.Version)('2'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "findAllV2", null);
__decorate([
    (0, common_1.Version)('2'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "findOneV2", null);
__decorate([
    (0, common_1.Version)('2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "createV2", null);
__decorate([
    (0, common_1.Version)('2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Post)('frozen'),
    (0, common_1.UsePipes)(freeze_pipe_1.FreezePipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "createFrozenV2", null);
__decorate([
    (0, common_1.Version)('2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "updateV2", null);
__decorate([
    (0, common_1.Version)('2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "removeV2", null);
exports.ScreeningTaskController = ScreeningTaskController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [screening_task_service_1.ScreeningTaskService])
], ScreeningTaskController);
//# sourceMappingURL=screening-task.controller.js.map