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
const swagger_1 = require("@nestjs/swagger");
const screening_task_service_1 = require("./screening-task.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const user_entity_1 = require("../auth/entities/user.entity");
const base_crud_controller_1 = require("../common/crud/base-crud.controller");
let ScreeningTaskController = class ScreeningTaskController extends base_crud_controller_1.BaseCrudController {
    constructor(taskService) {
        super(taskService);
        this.taskService = taskService;
    }
    findAll() {
        return super.findAll();
    }
    findOne(id) {
        return super.findOne(id);
    }
    create(createTaskDto) {
        return super.create(createTaskDto);
    }
    update(id, updateTaskDto) {
        return super.update(id, updateTaskDto);
    }
    remove(id) {
        return super.removeSoft(id);
    }
};
exports.ScreeningTaskController = ScreeningTaskController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List tasks', description: 'Returns all tasks.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task by id', description: 'Returns a single task by id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create task (manager/admin)',
        description: 'Creates a new task. Requires MANAGER or ADMIN role.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                name: 'Check projector',
                description: 'Verify projector is working before the first screening.',
                date: '2026-02-01',
                status: 'PENDING',
                screeningId: '550e8400-e29b-41d4-a716-446655440000',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update task (manager/admin)',
        description: 'Updates an existing task by id. Requires MANAGER or ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task id' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                status: 'DONE',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete task (soft) (manager/admin)',
        description: 'Soft-deletes a task by id. Requires MANAGER or ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreeningTaskController.prototype, "remove", null);
exports.ScreeningTaskController = ScreeningTaskController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [screening_task_service_1.ScreeningTaskService])
], ScreeningTaskController);
//# sourceMappingURL=screening-task.controller.js.map