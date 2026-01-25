import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
