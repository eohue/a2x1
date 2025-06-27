import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { House } from './House.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => House)
  @JoinColumn({ name: 'house_id' })
  house: House;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: '일반', comment: '채널(이벤트, 공지, 소모임 등)' })
  channel: string;

  @Column({ nullable: true, comment: '첨부 이미지 URL' })
  image_url?: string;

  @Column({ nullable: true, comment: '첨부 비디오 URL' })
  video_url?: string;

  @Column({ default: 'approved', comment: '게시물 상태(pending, approved, rejected, deleted)' })
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
} 