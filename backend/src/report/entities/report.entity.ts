import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ReportStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
}

export enum ReportCategory {
  BUG = 'bug',
  PAYMENT = 'payment',
  CONTENT = 'content',
  OTHER = 'other',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportCategory, default: ReportCategory.OTHER })
  category: ReportCategory;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.OPEN })
  status: ReportStatus;

  @Column({ type: 'uuid', nullable: true })
  movieId: string | null;

  @Column({ type: 'uuid', nullable: true })
  reviewId: string | null;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  resolvedByUserId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolvedByUserId' })
  resolvedByUser: User | null;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
