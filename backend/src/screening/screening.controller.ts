import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('screenings')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Version('2')
  @Get()
  findAllV2(@Query('movieId') movieId?: string) {
    return this.screeningService.findAllV2(movieId);
  }

  @Version('2')
  @Get('today')
  findTodayV2() {
    return this.screeningService.findTodayV2();
  }

  @Version('2')
  @Get(':id')
  findOneV2(@Param('id') id: string) {
    return this.screeningService.findOneV2(id);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  createV2(@Body() dto: CreateScreeningDto) {
    return this.screeningService.createV2(dto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  updateV2(@Param('id') id: string, @Body() dto: UpdateScreeningDto) {
    return this.screeningService.updateV2(id, dto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  removeV2(@Param('id') id: string) {
    return this.screeningService.removeV2(id);
  }
}
