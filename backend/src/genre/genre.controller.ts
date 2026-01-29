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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';
import { BaseCrudController } from '../common/crud/base-crud.controller';
import { Genre } from './entities/genre.entity';

@ApiTags('Genres')
@ApiBearerAuth()
@Controller('genres')
export class GenreController extends BaseCrudController<Genre, CreateGenreDto, UpdateGenreDto> {
  constructor(private readonly genreService: GenreService) {
    super(genreService);
  }

  @Get()
  @ApiOperation({ summary: 'List genres', description: 'Returns all genres.' })
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by id', description: 'Returns a single genre by id.' })
  @ApiParam({ name: 'id', description: 'Genre id' })
  findOne(@Param('id') id: string) {
    return super.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create genre (admin)', description: 'Creates a new genre. Requires ADMIN role.' })
  @ApiBody({
    schema: {
      example: {
        designation: 'Sci-Fi',
      },
    },
  })
  create(@Body() createGenreDto: CreateGenreDto) {
    return super.create(createGenreDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update genre (admin)', description: 'Updates an existing genre by id. Requires ADMIN role.' })
  @ApiParam({ name: 'id', description: 'Genre id' })
  @ApiBody({
    schema: {
      example: {
        designation: 'Science Fiction',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return super.update(id, updateGenreDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete genre (admin)', description: 'Deletes a genre by id. Requires ADMIN role.' })
  @ApiParam({ name: 'id', description: 'Genre id' })
  remove(@Param('id') id: string) {
    return this.genreService.remove(id);
  }
}
