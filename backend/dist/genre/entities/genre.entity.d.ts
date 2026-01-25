import { Movie } from '../../movie/entities/movie.entity';
export declare class Genre {
    id: string;
    designation: string;
    movies: Movie[];
    createdAt: Date;
    updatedAt: Date;
}
