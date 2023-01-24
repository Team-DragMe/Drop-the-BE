import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plan } from './Plan';
import { DailyNote } from './DailyNote';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'sns_id', nullable: false })
  snsId!: string;

  @Column({ nullable: false })
  email!: string;

  // 마이페이지 뷰 작업 나오면 글자수 제한 수정 필요
  @Column({ length: 10, nullable: false })
  nick?: string;

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
