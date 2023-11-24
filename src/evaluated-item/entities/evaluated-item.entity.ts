import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { EvaluationAssignment } from '../../evaluation-assignment/entities/evaluation-assignment.entity';

@Entity('evaluated_items')
export class EvaluatedItem {
  @PrimaryGeneratedColumn({ name: 'evaluated_item_id' })
  evaluatedItemId: number;

  @Column()
  comment: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @JoinColumn({ name: 'item_id' })
  @ManyToOne((type) => Item, (item) => item.evaluatedItems)
  item: Item;

  @JoinColumn({ name: 'evaluation_assignment_id' })
  @ManyToOne(
    (type) => EvaluationAssignment,
    (assignment) => assignment.evaluatedItems,
  )
  evaluationAssignment: EvaluationAssignment;
}
