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
import { EvaluatedItem } from '../../evaluated-item/entities/evaluated-item.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn({ name: 'item_id' })
  @Exclude()
  itemId: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @JoinColumn({ name: 'assignment_id' })
  @ManyToOne((type) => Assignment, (assignment) => assignment.items)
  assignment: Assignment;

  @OneToMany((type) => EvaluatedItem, (evaluatedItem) => evaluatedItem.item, {
    cascade: true, // ['insert']
  })
  @Exclude()
  evaluatedItems: EvaluatedItem[];
}
