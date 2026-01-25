import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenreController {
    private readonly genreService;
    constructor(genreService: GenreService);
    findAll(): Promise<import("./entities/genre.entity").Genre[]>;
    findOne(id: string): Promise<import("./entities/genre.entity").Genre>;
    create(createGenreDto: CreateGenreDto): Promise<import("./entities/genre.entity").Genre>;
    update(id: string, updateGenreDto: UpdateGenreDto): Promise<import("./entities/genre.entity").Genre>;
    remove(id: string): Promise<void>;
    fusionGenres(genres: string[]): {
        fusedGenres: string[];
    };
}
