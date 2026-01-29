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
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createV2(@Request() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingService.createV2(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMineV2(@Request() req: any) {
    return this.bookingService.findMineV2(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Get()
  findAllV2(@Query('date') date?: string) {
    return this.bookingService.findAllV2(date);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id/cancel')
  cancelV2(@Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.bookingService.cancelV2(id, dto.status ?? BookingStatus.CANCELLED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  removeV2(@Param('id') id: string) {
    return this.bookingService.removeV2(id);
  }
}
