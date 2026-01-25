import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

// Exercise 3.1: Use PartialType for Update DTOs
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
