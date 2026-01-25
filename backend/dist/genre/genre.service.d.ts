import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenreService {
    private genreRepository;
    constructor(genreRepository: Repository<Genre>);
    findAll(): Promise<Genre[]>;
    findOne(id: string): Promise<Genre>;
    create(createGenreDto: CreateGenreDto): Promise<Genre>;
    update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre>;
    remove(id: string): Promise<void>;
}
