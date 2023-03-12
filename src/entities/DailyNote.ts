import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'dailynotes' })
@Unique(['planDate'])
export class DailyNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'plan_date', nullable: true })
  planDate?: string;

  @Column({ nullable: true })
  emoji?: string;

  @Column({ nullable: true })
  feel?: string;

  @Column({ nullable: true })
  memo?: string;

  @ManyToOne(() => User, (user) => user.dailynotes)
  user?: User;
}
