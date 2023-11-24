import { Topic } from '../../topic/entities/topic.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn({ name: 'resource_id' })
  @Exclude()
  resourceId: number;

  @Column()
  label: string;

  @Column()
  url: string;

  @JoinColumn({ name: 'topic_id' })
  @ManyToOne((type) => Topic, (topic) => topic.resources)
  topic: Topic;
}
