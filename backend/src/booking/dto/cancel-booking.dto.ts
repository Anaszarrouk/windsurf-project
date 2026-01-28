import { IsIn, IsOptional } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CancelBookingDto {
  @IsOptional()
  @IsIn([BookingStatus.CANCELLED, BookingStatus.REFUNDED])
  status?: BookingStatus.CANCELLED | BookingStatus.REFUNDED;
}
