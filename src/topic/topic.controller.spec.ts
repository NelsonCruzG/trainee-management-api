import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockTopic, mockTopicDto } from '../utils/mocks/topic.mock';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { Topic } from './entities/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { ModuleService } from '../module/module.service';

describe('TopicController', () => {
  let controller: TopicController;
  let service: TopicService;

  const { topicId, ...result } = mockTopic;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        TopicService,
        {
          provide: getRepositoryToken(Topic),
          useValue: createMockRepository(),
        },
        {
          provide: ModuleService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TopicController>(TopicController);
    service = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all topics', async () => {
      const expected: Topic[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll(topicId)).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one topic', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockTopic);
      expect(await controller.findOne(topicId, topicId)).toBe(mockTopic);
    });
  });

  describe('create', () => {
    it('Should create and return the topic', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => mockTopic);
      expect(await controller.create(mockTopicDto, topicId)).toBe(mockTopic);
    });
  });

  describe('update', () => {
    it('Should update and return the topic', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => mockTopic);
      expect(await controller.update(topicId, mockTopicDto, topicId)).toBe(
        mockTopic,
      );
    });
  });

  describe('delete', () => {
    it('Should remove one topic', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(topicId, topicId)).toBe(undefined);
    });
  });
});
