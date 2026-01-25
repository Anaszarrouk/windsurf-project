import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Genre } from '../../genre/entities/genre.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  duration: number;

  @Column({ nullable: true })
  poster: string;

  @Column()
  director: string;

  @ManyToOne(() => User, (user) => user.movies)
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable({
    name: 'movie_genres',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genreId', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;
}
