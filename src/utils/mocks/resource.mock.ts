import { Topic } from '../../topic/entities/topic.entity';
import { Resource } from '../../resource/entities/resource.entity';
import { CreateResourceDto } from '../../resource/dto/create-resource.dto';

export const mockResource: Resource = {
  resourceId: 1,
  label: 'label',
  url: 'www.url.com',
  topic: new Topic(),
};

export const mockResourceDto: CreateResourceDto = {
  label: 'label',
  url: 'www.url.com',
  topicId: 1,
};
