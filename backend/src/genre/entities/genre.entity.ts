import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  designation: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
