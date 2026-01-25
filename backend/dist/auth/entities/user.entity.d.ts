import { Movie } from '../../movie/entities/movie.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MANAGER = "manager"
}
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    movies: Movie[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    version: number;
}
