import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { Post } from './Post.entity';
import { Event } from './Event.entity';
import { ReportHistory } from './ReportHistory.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  post?: Post;

  @ManyToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event?: Event;

  @Column({ comment: '신고 유형(예: abuse, spam 등)' })
  type: string;

  @Column('text')
  content: string;

  @Column({ default: 'submitted', comment: '민원 상태(접수, 처리중, 완료, 반려 등)' })
  status: 'submitted' | 'in_progress' | 'resolved' | 'rejected';

  @Column('text', { array: true, nullable: true, comment: '첨부파일(S3 등 URL 배열)' })
  attachments?: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => ReportHistory, (history) => history.report)
  history: ReportHistory[];
} 