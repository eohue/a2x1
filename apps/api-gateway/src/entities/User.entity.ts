import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { encrypt, decrypt } from '../../../../libs/common/crypto';

const CryptoTransformer = {
  to: (value: string) => (value ? encrypt(value) : value),
  from: (value: string) => (value ? decrypt(value) : value),
};

@Entity('users')
@Index(['tenant_id', 'email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column({ comment: '이메일(암호화 저장)', transformer: CryptoTransformer })
  email: string;

  @Column({ comment: '이름(암호화 저장)', transformer: CryptoTransformer })
  name: string;

  @Column({ nullable: true, comment: '전화번호(암호화 저장)', transformer: CryptoTransformer })
  phone?: string;

  @Column({ default: 'resident' })
  role: 'resident' | 'admin' | 'manager' | 'super';

  @Column({ comment: '비밀번호 해시' })
  password: string;

  @Column({ nullable: true, comment: 'FCM 푸시 토큰' })
  fcm_token?: string;

  @Column({ default: 'pending', comment: '회원 상태(pending, approved, rejected, expelled)' })
  status: 'pending' | 'approved' | 'rejected' | 'expelled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
} 