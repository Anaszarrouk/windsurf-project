import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';

export enum ScreeningStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('screenings')
export class Screening {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'datetime' })
  startsAt: Date;

  @Index()
  @Column({ type: 'datetime' })
  endsAt: Date;

  @Column({ default: 'Room 1' })
  room: string;

  @Column({ type: 'int', default: 100 })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  ticketsSold: number;

  @Column({
    type: 'enum',
    enum: ScreeningStatus,
    default: ScreeningStatus.SCHEDULED,
  })
  status: ScreeningStatus;

  @ManyToOne(() => Movie, { eager: true })
  movie: Movie;

  @Index()
  @Column()
  movieId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;
}
