import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'dailynotes' })
export class DailyNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'plan_date', nullable: false })
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
