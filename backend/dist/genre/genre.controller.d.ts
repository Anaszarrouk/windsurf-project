import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { BaseCrudController } from '../common/crud/base-crud.controller';
import { Genre } from './entities/genre.entity';
export declare class GenreController extends BaseCrudController<Genre, CreateGenreDto, UpdateGenreDto> {
    private readonly genreService;
    constructor(genreService: GenreService);
    findAll(): Promise<Genre[]>;
    findOne(id: string): Promise<Genre>;
    create(createGenreDto: CreateGenreDto): Promise<Genre>;
    update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre>;
    remove(id: string): Promise<void>;
}
