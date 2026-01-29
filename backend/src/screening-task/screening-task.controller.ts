import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScreeningTaskService } from './screening-task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';
import { BaseCrudController } from '../common/crud/base-crud.controller';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class ScreeningTaskController extends BaseCrudController<Task, CreateTaskDto, UpdateTaskDto> {
  constructor(private readonly taskService: ScreeningTaskService) {
    super(taskService);
  }

  @Get()
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return super.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return super.create(createTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return super.update(id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return super.removeSoft(id);
  }
}
