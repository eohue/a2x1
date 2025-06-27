import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LivingGuide } from './LivingGuide.entity';
import { User } from './User.entity';

export type LivingGuideChangeType = 'edit' | 'submit' | 'approve' | 'reject' | 'rollback';

@Entity('living_guide_histories')
export class LivingGuideHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LivingGuide, { nullable: false })
  @JoinColumn({ name: 'guide_id' })
  guide: LivingGuide;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'varchar', length: 20 })
  change_type: LivingGuideChangeType;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'changed_by' })
  changed_by: User;

  @CreateDateColumn()
  changed_at: Date;

  @Column({ type: 'varchar', length: 36 })
  tenant_id: string;
} 