import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    findAll(): Promise<(import("./entities/movie.entity").Movie & {
        avgRating: number;
        reviewCount: number;
    })[]>;
    findOne(id: string): Promise<import("./entities/movie.entity").Movie & {
        avgRating: number;
        reviewCount: number;
    }>;
    create(createMovieDto: CreateMovieDto): Promise<import("./entities/movie.entity").Movie>;
    update(id: string, updateMovieDto: UpdateMovieDto): Promise<import("./entities/movie.entity").Movie>;
    remove(id: string): Promise<void>;
}
