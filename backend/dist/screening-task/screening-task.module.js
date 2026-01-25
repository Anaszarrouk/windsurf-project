"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTaskModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const screening_task_service_1 = require("./screening-task.service");
const screening_task_controller_1 = require("./screening-task.controller");
const task_entity_1 = require("./entities/task.entity");
const common_module_1 = require("../common/common.module");
let ScreeningTaskModule = class ScreeningTaskModule {
};
exports.ScreeningTaskModule = ScreeningTaskModule;
exports.ScreeningTaskModule = ScreeningTaskModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task]), common_module_1.CommonModule],
        controllers: [screening_task_controller_1.ScreeningTaskController],
        providers: [screening_task_service_1.ScreeningTaskService],
        exports: [screening_task_service_1.ScreeningTaskService],
    })
], ScreeningTaskModule);
//# sourceMappingURL=screening-task.module.js.map