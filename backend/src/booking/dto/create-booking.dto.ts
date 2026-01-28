import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  screeningId: string;

  @IsInt()
  @Min(1)
  seatsCount: number;
}
