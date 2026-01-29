import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Get()
  @ApiOperation({ summary: 'List movies', description: 'Returns all movies.' })
  findAll() {
    return this.movieService.findAllV2();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id', description: 'Returns a single movie by id.' })
  @ApiParam({ name: 'id', description: 'Movie id' })
  findOne(@Param('id') id: string) {
    return this.movieService.findOneV2(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create movie (admin)', description: 'Creates a new movie. Requires ADMIN role.' })
  @ApiBody({
    schema: {
      example: {
        title: 'Inception',
        duration: 148,
        poster: 'https://example.com/posters/inception.jpg',
        price: 12.5,
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        director: 'Christopher Nolan',
        genreIds: ['550e8400-e29b-41d4-a716-446655440000'],
      },
    },
  })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createV2(createMovieDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update movie (admin)', description: 'Updates an existing movie by id. Requires ADMIN role.' })
  @ApiParam({ name: 'id', description: 'Movie id' })
  @ApiBody({
    schema: {
      example: {
        title: 'Inception (Director\'s Cut)',
        price: 14,
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateV2(id, updateMovieDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie (admin)', description: 'Deletes a movie by id. Requires ADMIN role.' })
  @ApiParam({ name: 'id', description: 'Movie id' })
  remove(@Param('id') id: string) {
    return this.movieService.removeV2(id);
  }
}
