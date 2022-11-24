import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'planorder' })
export class PlanOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.dailyplans)
  user?: User;

  @Column({ name: 'type' })
  type?: string;

  @Column({ name: 'plan_date', nullable: false })
  planDate?: Date;

  @Column('int', { name: 'plan_list', array: true })
  planList?: number[];
}
