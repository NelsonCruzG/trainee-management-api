import { ModuleEntity } from '../../module/entities/module.entity';
import { CreateTopicDto } from '../../topic/dto/create-topic.dto';
import { Topic } from '../../topic/entities/topic.entity';

export const mockTopic: Topic = {
  topicId: 1,
  name: 'topic name',
  module: new ModuleEntity(),
  resources: [],
};

export const mockTopicDto: CreateTopicDto = {
  name: 'topic name',
  moduleId: 1,
};
