import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FusionUpperPipe } from '../common/pipes/fusion-upper.pipe';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(id, updateGenreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genreService.remove(id);
  }

  // Exercise 6.1: Endpoint using FusionUpperPipe
  @Post('fusion')
  @UsePipes(FusionUpperPipe)
  fusionGenres(@Body('genres') genres: string[]) {
    return { fusedGenres: genres };
  }
}
