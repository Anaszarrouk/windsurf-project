import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ReviewService } from '../review/review.service';
export interface MovieModel {
    id: string;
    title: string;
    duration: number;
    poster: string;
    director: string;
    price?: number;
    trailerUrl?: string;
}
export declare class MovieService {
    private movieRepository;
    private genreRepository;
    private reviewService;
    private moviesInMemory;
    private idCounter;
    constructor(movieRepository: Repository<Movie>, genreRepository: Repository<Genre>, reviewService: ReviewService);
    findAllV1(): MovieModel[];
    findOneV1(id: string): MovieModel;
    createV1(createMovieDto: CreateMovieDto): MovieModel;
    updateV1(id: string, updateMovieDto: UpdateMovieDto): MovieModel;
    removeV1(id: string): void;
    findAllV2(): Promise<(Movie & {
        avgRating: number;
        reviewCount: number;
    })[]>;
    findOneV2(id: string): Promise<Movie & {
        avgRating: number;
        reviewCount: number;
    }>;
    createV2(createMovieDto: CreateMovieDto): Promise<Movie>;
    updateV2(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie>;
    removeV2(id: string): Promise<void>;
}
