import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Program } from '../../program/entities/program.entity';
import { User } from '../../user/entities/users.entity';

@Entity('executions')
export class Execution {
  @PrimaryGeneratedColumn({ name: 'execution_id' })
  executionId: number;

  @Column()
  name: string;

  @Column({ name: 'image_url', default: '' })
  imageUrl: string;

  @Column({ default: '' })
  description: string;

  @Column('timestamp with time zone', { default: 'NOW()' })
  begins: Date;

  @Column('timestamp with time zone', { default: 'NOW()' })
  ends: Date;

  @Column({ default: false, select: false })
  management: boolean;

  @JoinTable({
    name: 'execution_users',
    joinColumn: { name: 'execution_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  @ManyToMany((type) => User, (user) => user.executions, {
    cascade: true, // ['insert']
  })
  users: User[];

  @JoinColumn({ name: 'program_id' })
  @ManyToOne((type) => Program, (program) => program.executions)
  program: Program;
}
