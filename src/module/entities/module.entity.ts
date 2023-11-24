import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Program } from '../../program/entities/program.entity';
import { Topic } from '../../topic/entities/topic.entity';

@Entity('modules')
export class ModuleEntity {
  @PrimaryGeneratedColumn({ name: 'module_id' })
  @Exclude()
  moduleId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @JoinColumn({ name: 'program_id' })
  @ManyToOne((type) => Program, (program) => program.modules)
  program: Program;

  @OneToMany((type) => Topic, (topic) => topic.module, {
    cascade: true, // ['insert']
  })
  topics: Topic[];

  @OneToMany((type) => Assignment, (assignment) => assignment.module, {
    cascade: true, // ['insert']
  })
  assignments: Assignment[];
}
