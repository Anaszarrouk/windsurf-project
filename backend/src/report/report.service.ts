import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../auth/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportStatus } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(userId: string, dto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create({
      userId,
      category: dto.category,
      message: dto.message,
      movieId: dto.movieId ?? null,
      reviewId: dto.reviewId ?? null,
      status: ReportStatus.OPEN,
      resolvedAt: null,
      resolvedByUserId: null,
    });
    return this.reportRepository.save(report);
  }

  async findAllForStaff(): Promise<Report[]> {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user', 'resolvedByUser'],
    });
  }

  async resolve(id: string, resolver: { id: string; role?: UserRole } | undefined): Promise<Report> {
    if (!resolver?.id) {
      throw new ForbiddenException();
    }

    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = ReportStatus.RESOLVED;
    report.resolvedByUserId = resolver.id;
    report.resolvedAt = new Date();

    return this.reportRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.reportRepository.remove(report);
  }
}
