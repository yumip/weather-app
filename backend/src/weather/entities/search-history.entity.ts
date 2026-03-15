import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('search_history')
export class SearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  city!: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  temperature!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp!: Date;
}
