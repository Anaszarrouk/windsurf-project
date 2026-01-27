import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ReviewService } from '../review/review.service';

// In-memory storage for v1
export interface MovieModel {
  id: string;
  title: string;
  duration: number;
  poster: string;
  director: string;
  price?: number;
  trailerUrl?: string;
}

@Injectable()
export class MovieService {
  private moviesInMemory: MovieModel[] = [];
  private idCounter = 1;

  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    private reviewService: ReviewService,
  ) {}

  // V1: In-memory CRUD operations
  findAllV1(): MovieModel[] {
    return this.moviesInMemory;
  }

  findOneV1(id: string): MovieModel {
    const movie = this.moviesInMemory.find((m) => m.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  createV1(createMovieDto: CreateMovieDto): MovieModel {
    const movie: MovieModel = {
      id: String(this.idCounter++),
      title: createMovieDto.title,
      duration: createMovieDto.duration,
      poster: createMovieDto.poster || '',
      director: createMovieDto.director,
      price: createMovieDto.price,
      trailerUrl: createMovieDto.trailerUrl,
    };
    this.moviesInMemory.push(movie);
    return movie;
  }

  updateV1(id: string, updateMovieDto: UpdateMovieDto): MovieModel {
    const index = this.moviesInMemory.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    this.moviesInMemory[index] = { ...this.moviesInMemory[index], ...updateMovieDto };
    return this.moviesInMemory[index];
  }

  removeV1(id: string): void {
    const index = this.moviesInMemory.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    this.moviesInMemory.splice(index, 1);
  }

  // V2: TypeORM CRUD operations
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
    const movie = await this.findOneV2(id);

    if (updateMovieDto.genreIds) {
      movie.genres = await this.genreRepository.find({
        where: { id: In(updateMovieDto.genreIds) },
      });
    }

    Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async removeV2(id: string): Promise<void> {
    const movie = await this.findOneV2(id);
    await this.movieRepository.softRemove(movie);
  }
}
