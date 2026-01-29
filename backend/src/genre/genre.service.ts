import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { BaseCrudService } from '../common/crud/base-crud.service';

@Injectable()
export class GenreService extends BaseCrudService<Genre> {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {
    super(genreRepository, 'Genre');
  }

  findAll(): Promise<Genre[]> {
    return super.findAll({ relations: ['movies'] });
  }

  findOne(id: string): Promise<Genre> {
    return super.findOne(id, { relations: ['movies'] });
  }

  create(createGenreDto: CreateGenreDto): Promise<Genre> {
    return super.create(createGenreDto);
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    return super.update(id, updateGenreDto);
  }

  remove(id: string): Promise<void> {
    return super.removeHard(id);
  }
}
