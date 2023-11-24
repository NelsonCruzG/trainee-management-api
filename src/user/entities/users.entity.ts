import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity';
import { Execution } from '../../execution/entities/execution.entity';
import { EvaluationAssignment } from '../../evaluation-assignment/entities/evaluation-assignment.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column('varchar', { length: 15 })
  phone: string;

  @Column()
  email: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: '' })
  description: string;

  @Exclude()
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'rol_id' },
  })
  @ManyToMany((type) => Rol, (rol) => rol.users, {
    cascade: true, // ['insert']
  })
  roles: Rol[];

  @Exclude()
  @JoinTable({
    name: 'evaluation_involves',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'evaluation_assignment_id' },
  })
  @ManyToMany(
    (type) => EvaluationAssignment,
    (evaluationAssignment) => evaluationAssignment.users,
    {
      cascade: true, // ['insert']
    },
  )
  evaluationAssignments: EvaluationAssignment[];

  @Exclude()
  @ManyToMany((type) => Execution, (execution) => execution.users)
  executions: Execution[];
}
