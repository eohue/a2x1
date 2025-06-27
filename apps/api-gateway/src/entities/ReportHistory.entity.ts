import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Report } from './Report.entity';
import { User } from './User.entity';

@Entity('report_histories')
export class ReportHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Report, (report) => report.history)
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ comment: '변경된 상태' })
  status: 'submitted' | 'in_progress' | 'resolved' | 'rejected';

  @Column({ comment: '처리/변경 사유', nullable: true })
  comment?: string;

  @CreateDateColumn()
  created_at: Date;
} 