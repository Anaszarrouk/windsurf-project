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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ScreeningService } from './screening.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Screenings')
@ApiBearerAuth()
@Controller('screenings')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Get()
  @ApiOperation({ summary: 'List screenings', description: 'Returns screenings. Optionally filter by movie id.' })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filter screenings by movie id' })
  findAllV2(@Query('movieId') movieId?: string) {
    return this.screeningService.findAllV2(movieId);
  }

  @Get('today')
  @ApiOperation({ summary: "List today's screenings", description: 'Returns screenings scheduled for today.' })
  findTodayV2() {
    return this.screeningService.findTodayV2();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get screening by id', description: 'Returns a single screening by id.' })
  @ApiParam({ name: 'id', description: 'Screening id' })
  findOneV2(@Param('id') id: string) {
    return this.screeningService.findOneV2(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create screening (admin)', description: 'Creates a new screening. Requires ADMIN role.' })
  @ApiBody({
    schema: {
      example: {
        movieId: '550e8400-e29b-41d4-a716-446655440000',
        startsAt: '2026-02-01T18:00:00.000Z',
        endsAt: '2026-02-01T20:30:00.000Z',
        room: 'Room A',
        capacity: 120,
        ticketsSold: 0,
        status: 'SCHEDULED',
      },
    },
  })
  createV2(@Body() dto: CreateScreeningDto) {
    return this.screeningService.createV2(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update screening (admin/manager)',
    description: 'Updates an existing screening by id. Requires ADMIN or MANAGER role.',
  })
  @ApiParam({ name: 'id', description: 'Screening id' })
  @ApiBody({
    schema: {
      example: {
        room: 'Room B',
        capacity: 150,
        status: 'CANCELLED',
      },
    },
  })
  updateV2(@Param('id') id: string, @Body() dto: UpdateScreeningDto) {
    return this.screeningService.updateV2(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete screening (admin)', description: 'Deletes a screening by id. Requires ADMIN role.' })
  @ApiParam({ name: 'id', description: 'Screening id' })
  removeV2(@Param('id') id: string) {
    return this.screeningService.removeV2(id);
  }
}
