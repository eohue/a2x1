import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { House } from './House.entity';
import { User } from './User.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => House)
  @JoinColumn({ name: 'house_id' })
  house: House;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  start_at: Date;

  @Column({ type: 'timestamp' })
  end_at: Date;

  @ManyToMany(() => User)
  @JoinTable({ name: 'event_participants', joinColumn: { name: 'event_id', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' } })
  participants: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
} 