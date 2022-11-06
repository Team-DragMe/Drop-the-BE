import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'dailyplans' })
export class DailyPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'plan_date', nullable: false })
  planDate?: Date;

  @Column({ name: 'plan_name', length: 100, nullable: false })
  planName?: string;

  @Column({ nullable: false })
  colorchip?: string;

  @Column({ name: 'plan_time' })
  planTime?: number;

  @Column({ name: 'fulfill_time' })
  fulfillTime?: number;

  @ManyToOne(() => User, (user) => user.dailyplans)
  user?: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: false })
  createdAt?: Date;
}
