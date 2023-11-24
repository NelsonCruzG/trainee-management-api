import { ModuleEntity } from '../../module/entities/module.entity';
import { Resource } from '../../resource/entities/resource.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn({ name: 'topic_id' })
  @Exclude()
  topicId: number;

  @Column()
  name: string;

  @JoinColumn({ name: 'module_id' })
  @ManyToOne((type) => ModuleEntity, (module) => module.topics)
  module: ModuleEntity;

  @OneToMany((type) => Resource, (resource) => resource.topic, {
    cascade: true, // ['insert']
  })
  resources: Resource[];
}
