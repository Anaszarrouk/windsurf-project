import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screening } from './entities/screening.entity';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Screening])],
  controllers: [ScreeningController],
  providers: [ScreeningService],
  exports: [ScreeningService],
})
export class ScreeningModule {}
