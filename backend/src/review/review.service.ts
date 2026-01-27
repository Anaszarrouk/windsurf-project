import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Movie } from '../movie/entities/movie.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(movieId: string, userId: string, dto: CreateReviewDto): Promise<Review> {
    if (!movieId) throw new BadRequestException('movieId is required');
    if (!userId) throw new BadRequestException('userId is required');

    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException(`Movie with ID ${movieId} not found`);

    const review = this.reviewRepository.create({
      movieId,
      userId,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });

    return this.reviewRepository.save(review);
  }

  async findByMovie(movieId: string): Promise<Review[]> {
    return this.reviewRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u')
      .where('r.movieId = :movieId', { movieId })
      .orderBy('r.createdAt', 'DESC')
      .select([
        'r.id',
        'r.rating',
        'r.comment',
        'r.movieId',
        'r.userId',
        'r.createdAt',
        'r.updatedAt',
        'u.id',
        'u.username',
        'u.email',
        'u.role',
        'u.banned',
      ])
      .getMany();
  }

  async getSummaryForMovie(movieId: string): Promise<{ avgRating: number; reviewCount: number }> {
    const raw = await this.reviewRepository
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avgRating')
      .addSelect('COUNT(r.id)', 'reviewCount')
      .where('r.movieId = :movieId', { movieId })
      .getRawOne<{ avgRating: string | null; reviewCount: string | null }>();

    const avg = raw?.avgRating == null ? 0 : Number(raw.avgRating);
    const count = raw?.reviewCount == null ? 0 : Number(raw.reviewCount);

    return {
      avgRating: Number.isFinite(avg) ? avg : 0,
      reviewCount: Number.isFinite(count) ? count : 0,
    };
  }

  async getSummariesForMovies(movieIds: string[]): Promise<Record<string, { avgRating: number; reviewCount: number }>> {
    if (!movieIds || movieIds.length === 0) return {};

    const rows = await this.reviewRepository
      .createQueryBuilder('r')
      .select('r.movieId', 'movieId')
      .addSelect('AVG(r.rating)', 'avgRating')
      .addSelect('COUNT(r.id)', 'reviewCount')
      .where('r.movieId IN (:...movieIds)', { movieIds })
      .groupBy('r.movieId')
      .getRawMany<{ movieId: string; avgRating: string; reviewCount: string }>();

    const out: Record<string, { avgRating: number; reviewCount: number }> = {};
    for (const row of rows) {
      const avg = Number(row.avgRating);
      const count = Number(row.reviewCount);
      out[row.movieId] = {
        avgRating: Number.isFinite(avg) ? avg : 0,
        reviewCount: Number.isFinite(count) ? count : 0,
      };
    }

    return out;
  }
}
