import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "dailynotes" })
export class DailyNote {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: "plan_date", nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  emoji: string;

  @Column({ nullable: false })
  feel: string;

  @Column({ nullable: false })
  memo: string;

  @ManyToOne(() => User, (user) => user.dailynotes)
  user: Promise<User>;
}
