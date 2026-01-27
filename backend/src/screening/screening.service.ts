import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Screening, ScreeningStatus } from './entities/screening.entity';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

@Injectable()
export class ScreeningService {
  constructor(
    @InjectRepository(Screening)
    private screeningRepository: Repository<Screening>,
  ) {}

  async findAllV2(movieId?: string): Promise<Screening[]> {
    const where = movieId ? { movieId } : {};
    return this.screeningRepository.find({
      where: where as any,
      order: { startsAt: 'ASC' },
    });
  }

  async findTodayV2(): Promise<Screening[]> {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return this.screeningRepository.find({
      where: {
        startsAt: Between(start, end),
      },
      order: { startsAt: 'ASC' },
    });
  }

  async findOneV2(id: string): Promise<Screening> {
    const screening = await this.screeningRepository.findOne({ where: { id } });
    if (!screening) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }
    return screening;
  }

  async createV2(dto: CreateScreeningDto): Promise<Screening> {
    const screening = this.screeningRepository.create({
      movieId: dto.movieId,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      room: dto.room ?? 'Room 1',
      capacity: dto.capacity ?? 100,
      ticketsSold: dto.ticketsSold ?? 0,
      status: dto.status ?? ScreeningStatus.SCHEDULED,
    });

    return this.screeningRepository.save(screening);
  }

  async updateV2(id: string, dto: UpdateScreeningDto): Promise<Screening> {
    const screening = await this.findOneV2(id);

    if (dto.movieId != null) screening.movieId = dto.movieId;
    if (dto.startsAt != null) screening.startsAt = new Date(dto.startsAt);
    if (dto.endsAt != null) screening.endsAt = new Date(dto.endsAt);
    if (dto.room != null) screening.room = dto.room;
    if (dto.capacity != null) screening.capacity = dto.capacity as any;
    if (dto.ticketsSold != null) screening.ticketsSold = dto.ticketsSold as any;
    if (dto.status != null) screening.status = dto.status;

    return this.screeningRepository.save(screening);
  }

  async removeV2(id: string): Promise<void> {
    const screening = await this.findOneV2(id);
    await this.screeningRepository.softRemove(screening);
  }
}
