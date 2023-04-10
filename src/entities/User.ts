import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plan } from './Plan';
import { DailyNote } from './DailyNote';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'sns_id', nullable: true })
  snsId!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ length: 10, nullable: false })
  nick?: string;

  @Column({ nullable: true })
  profile?: string;

  @Column({ length: 35, nullable: true })
  goal?: string;

  // 로그인한 플랫폼. ex) google
  @Column({ nullable: false })
  provider!: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @OneToMany(() => Plan, (plan) => plan.user)
  dailyplans?: Plan[];

  @OneToMany(() => DailyNote, (dailynotes) => dailynotes.user)
  dailynotes?: Plan[];
}
