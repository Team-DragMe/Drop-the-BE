import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'plans' })
export class Plan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'plan_date', nullable: true })
  planDate?: Date;

  @Column({ name: 'plan_name', length: 100, nullable: false })
  planName?: string;

  @Column({ nullable: false })
  colorchip?: string;

  @Column('int', { name: 'plan_time', array: true, nullable: true })
  planTime?: number[];

  @Column('int', { name: 'fulfill_time', array: true, nullable: true })
  fulfillTime?: number[];

  @Column('boolean', { name: 'is_completed', nullable: false, default: false })
  isCompleted?: boolean;

  @ManyToOne(() => User, (user) => user.dailyplans)
  user?: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: false })
  createdAt?: Date;
}
