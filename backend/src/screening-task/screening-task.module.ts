import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreeningTaskService } from './screening-task.service';
import { ScreeningTaskController } from './screening-task.controller';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [ScreeningTaskController],
  providers: [ScreeningTaskService],
  exports: [ScreeningTaskService],
})
export class ScreeningTaskModule {}
