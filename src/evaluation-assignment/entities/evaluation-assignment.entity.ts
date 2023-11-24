import { EvaluatedItem } from '../../evaluated-item/entities/evaluated-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/users.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';

@Entity('evaluation_assignments')
export class EvaluationAssignment {
  @PrimaryGeneratedColumn({ name: 'evaluation_assignment_id' })
  evaluationAssignmentId: number;

  @Column({ default: '' })
  url: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date: Date;

  @JoinColumn({ name: 'assignment_id' })
  @ManyToOne((type) => Assignment, (assignment) => assignment.items)
  assignment: Assignment;

  @OneToMany((type) => EvaluatedItem, (item) => item.evaluationAssignment, {
    cascade: true, // ['insert']
  })
  evaluatedItems: EvaluatedItem[];

  @ManyToMany((type) => User, (user) => user.evaluationAssignments)
  users: User[];
}
