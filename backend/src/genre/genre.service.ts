import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.find({ relations: ['movies'] });
  }

  async findOne(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);
    return this.genreRepository.save(genre);
  }

  async remove(id: string): Promise<void> {
    const genre = await this.findOne(id);
    await this.genreRepository.remove(genre);
  }
}
