import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EvaluationAssignment } from '../../evaluation-assignment/entities/evaluation-assignment.entity';
import { Item } from '../../item/entities/item.entity';
import { ModuleEntity } from '../../module/entities/module.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn({ name: 'assignment_id' })
  @Exclude()
  assignmentId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ default: false })
  public: boolean;

  @JoinColumn({ name: 'module_id' })
  @ManyToOne((type) => ModuleEntity, (module) => module.assignments)
  module: ModuleEntity;

  @OneToMany((type) => Item, (item) => item.assignment, {
    cascade: true, // ['insert']
  })
  items: Item[];

  @Exclude()
  @OneToMany(
    (type) => EvaluationAssignment,
    (evaluationAssignment) => evaluationAssignment.assignment,
    {
      cascade: true, // ['insert']
    },
  )
  evaluationAssignments: EvaluationAssignment[];
}
