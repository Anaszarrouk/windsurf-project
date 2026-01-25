import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
  UsePipes,
} from '@nestjs/common';
import { ScreeningTaskService } from './screening-task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FreezePipe } from '../common/pipes/freeze.pipe';

// Exercise 2.1: ScreeningTaskController with CRUD endpoints using URI Versioning
@Controller('tasks')
export class ScreeningTaskController {
  constructor(private readonly taskService: ScreeningTaskService) {}

  // V1 Endpoints (In-memory storage with UUID)
  @Version('1')
  @Get()
  findAllV1() {
    return this.taskService.findAllV1();
  }

  @Version('1')
  @Get(':id')
  findOneV1(@Param('id') id: string) {
    return this.taskService.findOneV1(id);
  }

  @Version('1')
  @Post()
  createV1(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createV1(createTaskDto);
  }

  @Version('1')
  @Patch(':id')
  updateV1(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateV1(id, updateTaskDto);
  }

  @Version('1')
  @Delete(':id')
  removeV1(@Param('id') id: string) {
    return this.taskService.removeV1(id);
  }

  // V2 Endpoints (TypeORM with MySQL)
  @Version('2')
  @Get()
  findAllV2() {
    return this.taskService.findAllV2();
  }

  @Version('2')
  @Get(':id')
  findOneV2(@Param('id') id: string) {
    return this.taskService.findOneV2(id);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Post()
  createV2(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createV2(createTaskDto);
  }

  // Exercise 6.2: Endpoint using FreezePipe
  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Post('frozen')
  @UsePipes(FreezePipe)
  createFrozenV2(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createV2(createTaskDto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateV2(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateV2(id, updateTaskDto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeV2(@Param('id') id: string) {
    return this.taskService.removeV2(id);
  }
}
