import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DailyPlan } from './DailyPlan';
import { DailyNote } from './DailyNote';
import { Reschedule } from './Reschedule';
import { RoutineRoad } from './RoutineRoad';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'sns_id', nullable: false })
  snsId!: number;

  @Column({ nullable: false })
  email!: string;

  // 마이페이지 뷰 작업 나오면 글자수 제한 수정 필요
  @Column({ length: 10, nullable: false })
  nick?: string;

  // 로그인한 플랫폼. ex) google
  @Column({ nullable: false })
  provider!: string;

  @OneToMany(() => DailyPlan, (dailyplans) => dailyplans.user)
  dailyplans?: DailyPlan[];

  @OneToMany(() => DailyNote, (dailynotes) => dailynotes.user)
  dailynotes?: DailyPlan[];

  @OneToMany(() => Reschedule, (reschedules) => reschedules.user)
  reschedules?: Reschedule[];

  @OneToMany(() => RoutineRoad, (routineroads) => routineroads.user)
  routineroads?: Reschedule[];
}
