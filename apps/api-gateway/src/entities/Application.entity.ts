import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User.entity';
import { House } from './House.entity';

@Entity('applications')
@Index(['tenant_id', 'user', 'house', 'status', 'created_at'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  tenant_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @ManyToOne(() => House)
  @JoinColumn({ name: 'house_id' })
  @Index()
  house: House;

  @Column({ comment: '신청자 이름(암호화 저장)' })
  applicant_name: string;

  @Column({ comment: '신청자 연락처(암호화 저장)' })
  applicant_contact: string;

  @Column({ default: 'pending' })
  @Index()
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true, comment: '거절 사유(선택)' })
  reason?: string;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
} 