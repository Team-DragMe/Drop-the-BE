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

  @Column()
  emoji?: string;

  @Column()
  feel?: string;

  @Column()
  memo?: string;

  @ManyToOne(() => User, (user) => user.dailynotes)
  user?: User;
}
