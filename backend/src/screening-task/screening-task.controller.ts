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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ScreeningTaskService } from './screening-task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';
import { BaseCrudController } from '../common/crud/base-crud.controller';
import { Task } from './entities/task.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class ScreeningTaskController extends BaseCrudController<Task, CreateTaskDto, UpdateTaskDto> {
  constructor(private readonly taskService: ScreeningTaskService) {
    super(taskService);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks', description: 'Returns all tasks.' })
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id', description: 'Returns a single task by id.' })
  @ApiParam({ name: 'id', description: 'Task id' })
  findOne(@Param('id') id: string) {
    return super.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create task (manager/admin)',
    description: 'Creates a new task. Requires MANAGER or ADMIN role.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Check projector',
        description: 'Verify projector is working before the first screening.',
        date: '2026-02-01',
        status: 'PENDING',
        screeningId: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return super.create(createTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update task (manager/admin)',
    description: 'Updates an existing task by id. Requires MANAGER or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiBody({
    schema: {
      example: {
        status: 'DONE',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return super.update(id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task (soft) (manager/admin)',
    description: 'Soft-deletes a task by id. Requires MANAGER or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Task id' })
  remove(@Param('id') id: string) {
    return super.removeSoft(id);
  }
}
