import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';

// Exercise 2.1: MovieController with CRUD endpoints using URI Versioning
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // V1 Endpoints (In-memory storage)
  @Version('1')
  @Get()
  findAllV1() {
    return this.movieService.findAllV1();
  }

  @Version('1')
  @Get(':id')
  findOneV1(@Param('id') id: string) {
    return this.movieService.findOneV1(id);
  }

  @Version('1')
  @Post()
  createV1(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createV1(createMovieDto);
  }

  @Version('1')
  @Patch(':id')
  updateV1(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateV1(id, updateMovieDto);
  }

  @Version('1')
  @Delete(':id')
  removeV1(@Param('id') id: string) {
    return this.movieService.removeV1(id);
  }

  // V2 Endpoints (TypeORM with MySQL)
  @Version('2')
  @Get()
  findAllV2() {
    return this.movieService.findAllV2();
  }

  @Version('2')
  @Get(':id')
  findOneV2(@Param('id') id: string) {
    return this.movieService.findOneV2(id);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  createV2(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createV2(createMovieDto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  updateV2(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateV2(id, updateMovieDto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  removeV2(@Param('id') id: string) {
    return this.movieService.removeV2(id);
  }
}
