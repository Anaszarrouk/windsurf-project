import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Screening } from '../screening/entities/screening.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Screening)
    private screeningRepository: Repository<Screening>,
    private dataSource: DataSource,
  ) {}

  async createV2(userId: string, dto: CreateBookingDto): Promise<Booking> {
    return this.dataSource.transaction(async (manager) => {
      const screeningRepo = manager.getRepository(Screening);
      const bookingRepo = manager.getRepository(Booking);

      const screening = await screeningRepo.findOne({ where: { id: dto.screeningId } });
      if (!screening) {
        throw new NotFoundException(`Screening with ID ${dto.screeningId} not found`);
      }

      const seatsCount = Number(dto.seatsCount);
      if (!Number.isFinite(seatsCount) || seatsCount <= 0) {
        throw new BadRequestException('Invalid seatsCount');
      }

      const bookedSeatsRaw = await bookingRepo
        .createQueryBuilder('b')
        .select('COALESCE(SUM(b.seatsCount), 0)', 'sum')
        .where('b.screeningId = :screeningId', { screeningId: screening.id })
        .andWhere('b.status = :status', { status: BookingStatus.PAID })
        .getRawOne();

      const alreadyBooked = Number((bookedSeatsRaw as any)?.sum ?? 0);
      const capacity = Number(screening.capacity) || 0;

      if (alreadyBooked + seatsCount > capacity) {
        throw new BadRequestException(`Not enough seats available. Remaining: ${Math.max(0, capacity - alreadyBooked)}`);
      }

      const price = Number((screening as any)?.movie?.price ?? 0);
      const totalPrice = Number.isFinite(price) ? Number((price * seatsCount).toFixed(2)) : 0;

      const booking = bookingRepo.create({
        userId,
        screeningId: screening.id,
        seatsCount,
        totalPrice,
        status: BookingStatus.PAID,
      });

      const saved = await bookingRepo.save(booking);
      await this.syncTicketsSold(manager, screening.id);
      return saved;
    });
  }

  async findMineV2(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllV2(date?: string): Promise<Booking[]> {
    if (!date) {
      return this.bookingRepository.find({ order: { createdAt: 'DESC' } });
    }

    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException('Invalid date. Use YYYY-MM-DD');
    }

    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);

    return this.bookingRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.user', 'user')
      .leftJoinAndSelect('b.screening', 'screening')
      .where('screening.startsAt BETWEEN :start AND :end', { start, end })
      .orderBy('b.createdAt', 'DESC')
      .getMany();
  }

  async cancelV2(id: string, status: BookingStatus.CANCELLED | BookingStatus.REFUNDED): Promise<Booking> {
    return this.dataSource.transaction(async (manager) => {
      const bookingRepo = manager.getRepository(Booking);
      const screeningRepo = manager.getRepository(Screening);

      const booking = await bookingRepo.findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (booking.status !== BookingStatus.PAID) {
        return booking;
      }

      booking.status = status;
      const saved = await bookingRepo.save(booking);

      const screening = await screeningRepo.findOne({ where: { id: booking.screeningId } });
      if (screening) {
        await this.syncTicketsSold(manager, screening.id);
      }

      return saved;
    });
  }

  private async syncTicketsSold(manager: any, screeningId: string): Promise<void> {
    const bookingRepo = manager.getRepository(Booking);
    const screeningRepo = manager.getRepository(Screening);

    const bookedSeatsRaw = await bookingRepo
      .createQueryBuilder('b')
      .select('COALESCE(SUM(b.seatsCount), 0)', 'sum')
      .where('b.screeningId = :screeningId', { screeningId })
      .andWhere('b.status = :status', { status: BookingStatus.PAID })
      .getRawOne();

    const bookedSeats = Number((bookedSeatsRaw as any)?.sum ?? 0);
    await screeningRepo.update({ id: screeningId }, { ticketsSold: bookedSeats as any });
  }
}
