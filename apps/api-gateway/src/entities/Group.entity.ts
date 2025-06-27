import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from 'User.entity';

/**
 * 소모임(그룹) 엔티티
 */
@Entity('groups')
@Index(['tenant_id', 'name'], { unique: true })
@Index(['tenant_id'])
@Index(['created_by'])
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', comment: '테넌트 구분자' })
  tenant_id: string;

  @Column({ type: 'varchar', comment: '그룹명' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '설명' })
  description?: string;

  @Column({ type: 'varchar', nullable: true, comment: '썸네일 URL' })
  thumbnail_url?: string;

  @ManyToOne(() => User, { nullable: false })
  created_by: User;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'group_members',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];

  @CreateDateColumn({ comment: '생성일' })
  created_at: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updated_at: Date;

  @Column({ type: 'boolean', default: false, comment: '소프트 삭제' })
  is_deleted: boolean;
} 