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

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: false })
  createdAt?: Date;

  @Column()
  emoji?: string;

  @Column()
  feel?: string;

  @Column()
  memo?: string;

  @ManyToOne(() => User, (user) => user.dailynotes)
  user?: User;
}
