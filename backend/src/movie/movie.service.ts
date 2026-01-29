import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ReviewService } from '../review/review.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    private reviewService: ReviewService,
  ) {}
  async findAllV2(): Promise<(Movie & { avgRating: number; reviewCount: number })[]> {
    const movies = await this.movieRepository.find({ relations: ['user', 'genres'] });
    const summaries = await this.reviewService.getSummariesForMovies(movies.map((m) => m.id));

    return movies.map((m) => {
      const s = summaries[m.id];
      return {
        ...(m as any),
        avgRating: s?.avgRating ?? 0,
        reviewCount: s?.reviewCount ?? 0,
      };
    });
  }

  async findOneV2(id: string): Promise<Movie & { avgRating: number; reviewCount: number }> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    const summary = await this.reviewService.getSummaryForMovie(movie.id);
    return {
      ...(movie as any),
      avgRating: summary.avgRating,
      reviewCount: summary.reviewCount,
    };
  }

  async createV2(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);

    if (createMovieDto.genreIds && createMovieDto.genreIds.length > 0) {
      movie.genres = await this.genreRepository.find({
        where: { id: In(createMovieDto.genreIds) },
      });
    }

    return this.movieRepository.save(movie);
  }

  async updateV2(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { genreIds, ...updatePayload } = updateMovieDto as any;

    const movie = await this.movieRepository.preload({
      id,
      ...(updatePayload as any),
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    if (genreIds) {
      movie.genres = await this.genreRepository.find({
        where: { id: In(genreIds) },
      });
    }

    return this.movieRepository.save(movie);
  }

  async removeV2(id: string): Promise<void> {
    const movie = await this.findOneV2(id);
    await this.movieRepository.softRemove(movie);
  }
}
