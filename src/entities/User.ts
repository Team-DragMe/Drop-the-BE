import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DailyPlan } from "./DailyPlan";
import { DailyNote } from "./DailyNote";
import { Reschedule } from "./Reschedule";
import { RoutineRoad } from "./RoutineRoad";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "sns_id", nullable: false })
  snsId: number;
  
  @Column({ nullable: false })
  email: string;

  @Column({ type: "varchar", length: 10, nullable: false })
  nick: string;

  @Column({ nullable: false })
  provider: string; // 로그인한 플랫폼

  @OneToMany(() => DailyPlan, (dailyplans) => dailyplans.user)
  dailyplans: Promise<DailyPlan[]>;

  @OneToMany(() => DailyNote, (dailynotes) => dailynotes.user)
  dailynotes: Promise<DailyPlan[]>;

  @OneToMany(() => Reschedule, (reschedules) => reschedules.user)
  reschedules: Promise<Reschedule[]>;

  @OneToMany(() => RoutineRoad, (routineroads) => routineroads.user)
  routineroads: Promise<Reschedule[]>;
}
