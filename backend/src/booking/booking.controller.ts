import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create booking', description: 'Creates a booking for the authenticated user.' })
  @ApiBody({
    schema: {
      example: {
        screeningId: '550e8400-e29b-41d4-a716-446655440000',
        seatsCount: 2,
      },
    },
  })
  createV2(@Request() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingService.createV2(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'List my bookings', description: 'Returns bookings for the authenticated user.' })
  findMineV2(@Request() req: any) {
    return this.bookingService.findMineV2(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'List bookings (staff)',
    description: 'Returns all bookings. Optionally filter by date. Requires MANAGER or ADMIN role.',
  })
  @ApiQuery({ name: 'date', required: false, description: 'Filter bookings by date (YYYY-MM-DD)' })
  findAllV2(@Query('date') date?: string) {
    return this.bookingService.findAllV2(date);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel booking (staff)',
    description: 'Cancels a booking by id. Requires MANAGER or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Booking id' })
  @ApiBody({
    schema: {
      example: {
        status: 'CANCELLED',
      },
    },
  })
  cancelV2(@Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.bookingService.cancelV2(id, dto.status ?? BookingStatus.CANCELLED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking (admin)', description: 'Deletes a booking by id. Requires ADMIN role.' })
  @ApiParam({ name: 'id', description: 'Booking id' })
  removeV2(@Param('id') id: string) {
    return this.bookingService.removeV2(id);
  }
}
