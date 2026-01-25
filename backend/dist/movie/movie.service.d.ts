import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export interface MovieModel {
    id: string;
    title: string;
    duration: number;
    poster: string;
    director: string;
}
export declare class MovieService {
    private movieRepository;
    private genreRepository;
    private moviesInMemory;
    private idCounter;
    constructor(movieRepository: Repository<Movie>, genreRepository: Repository<Genre>);
    findAllV1(): MovieModel[];
    findOneV1(id: string): MovieModel;
    createV1(createMovieDto: CreateMovieDto): MovieModel;
    updateV1(id: string, updateMovieDto: UpdateMovieDto): MovieModel;
    removeV1(id: string): void;
    findAllV2(): Promise<Movie[]>;
    findOneV2(id: string): Promise<Movie>;
    createV2(createMovieDto: CreateMovieDto): Promise<Movie>;
    updateV2(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie>;
    removeV2(id: string): Promise<void>;
}
