import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from 'typeorm';

export enum TaskStatus {
  EN_ATTENTE = 'En attente',
  EN_COURS = 'En cours',
  FINALISE = 'Finalisé',
}

@Entity('screening_tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime', nullable: true })
  date: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.EN_ATTENTE,
  })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;
}
