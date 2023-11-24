import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Execution } from '../../execution/entities/execution.entity';
import { ModuleEntity } from '../../module/entities/module.entity';

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn({ name: 'program_id' })
  @Exclude()
  programId: number;

  @Column()
  name: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column()
  description: string;

  @JoinColumn({ name: 'parent' })
  @ManyToOne((type) => Program, (program) => program.childPrograms)
  parentProgram: Program;

  @OneToMany((type) => Program, (program) => program.parentProgram)
  childPrograms: Program[];

  @OneToMany((type) => Execution, (exec) => exec.program, {
    cascade: true, // ['insert']
  })
  @Exclude()
  executions: Execution[];

  @OneToMany((type) => ModuleEntity, (module) => module.program, {
    cascade: true, // ['insert']
  })
  modules: ModuleEntity[];
}
