import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'routineroads' })
export class RoutineRoad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'plan_name', length: 100, nullable: false })
  planName?: string;

  @Column({ nullable: false })
  colorchip?: string;

  @ManyToOne(() => User, (user) => user.routineroads)
  user?: User;
}
