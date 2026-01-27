import { User } from '../../auth/entities/user.entity';
import { Genre } from '../../genre/entities/genre.entity';
import { Review } from '../../review/entities/review.entity';
export declare class Movie {
    id: string;
    title: string;
    duration: number;
    poster: string;
    price: number;
    trailerUrl: string;
    director: string;
    user: User;
    userId: string;
    genres: Genre[];
    reviews: Review[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    version: number;
}
