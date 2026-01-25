import { User } from '../../auth/entities/user.entity';
import { Genre } from '../../genre/entities/genre.entity';
export declare class Movie {
    id: string;
    title: string;
    duration: number;
    poster: string;
    director: string;
    user: User;
    userId: string;
    genres: Genre[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    version: number;
}
