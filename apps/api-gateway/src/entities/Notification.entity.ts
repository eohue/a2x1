import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 'general', comment: '알림 유형(공지, 승인, 민원, 이벤트 등)' })
  type: string;

  @Column('text', { comment: '알림 내용' })
  content: string;

  @Column({ nullable: true, comment: '관련 링크(선택)' })
  link?: string;

  @Column({ type: 'jsonb', nullable: true, comment: '추가 메타데이터(선택)' })
  meta?: Record<string, any>;

  @Column({ default: false, comment: '읽음 여부' })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
} 