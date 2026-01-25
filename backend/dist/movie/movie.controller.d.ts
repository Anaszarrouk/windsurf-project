import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    findAllV1(): import("./movie.service").MovieModel[];
    findOneV1(id: string): import("./movie.service").MovieModel;
    createV1(createMovieDto: CreateMovieDto): import("./movie.service").MovieModel;
    updateV1(id: string, updateMovieDto: UpdateMovieDto): import("./movie.service").MovieModel;
    removeV1(id: string): void;
    findAllV2(): Promise<import("./entities/movie.entity").Movie[]>;
    findOneV2(id: string): Promise<import("./entities/movie.entity").Movie>;
    createV2(createMovieDto: CreateMovieDto): Promise<import("./entities/movie.entity").Movie>;
    updateV2(id: string, updateMovieDto: UpdateMovieDto): Promise<import("./entities/movie.entity").Movie>;
    removeV2(id: string): Promise<void>;
}
