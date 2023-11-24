import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { TopicService } from './topic.service';
import { Topic } from './entities/topic.entity';
import { NotFoundException } from '@nestjs/common';
import { mockTopic, mockTopicDto } from '../utils/mocks/topic.mock';
import { ModuleService } from '../module/module.service';
import { mockModuleEntity } from '../utils/mocks/module.mock';

describe('TopicService', () => {
  let service: TopicService;
  let moduleService: ModuleService;
  let repository: MockRepository;
  const { topicId, ...result } = mockTopic;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TopicService>(TopicService);
    moduleService = module.get<ModuleService>(ModuleService);
    repository = module.get<MockRepository>(getRepositoryToken(Topic));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all Topics', async () => {
      const expectedTopics: Topic[] = [];

      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnThis();
      selectBuilder.addSelect.mockReturnThis();
      selectBuilder.getMany.mockReturnValue(expectedTopics);
      const topics = await service.findAll(topicId);
      expect(topics).toEqual(expectedTopics);
    });
  });

  describe('findOne', () => {
    describe('When topic exists', () => {
      it('Should return the topic', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockTopic]);
        const topic = await service.findOne(topicId, topicId);
        expect(topic).toEqual(mockTopic);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);

        try {
          await service.findOne(topicId, topicId);
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
        }
      });
    });
  });

  describe('create', () => {
    describe('If module is not null', () => {
      it('Should create and return the new topic', async () => {
        jest
          .spyOn(moduleService, 'findOne')
          .mockResolvedValue(mockModuleEntity);

        repository.create.mockReturnValue(mockTopic);
        repository.save.mockReturnValue(mockTopic);
        const module = await service.create(mockTopicDto, topicId);
        expect(module).toEqual(mockTopic);
      });
    });

    describe('If module is null', () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(moduleService, 'findOne').mockResolvedValue(undefined);

        try {
          await service.create(mockTopicDto, topicId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Module with ID #${topicId} not found`);
        }
      });
    });
  });

  describe('update', () => {
    describe("If topic doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);
        jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(topicId, mockTopicDto, topicId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Topic with ID #${topicId} not found`);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the topic', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockTopic]);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockTopic);
        repository.preload.mockReturnValue(mockTopic);
        repository.save.mockReturnValue(mockTopic);
        const topic = await service.update(topicId, mockTopicDto, topicId);
        expect(topic).toEqual(mockTopic);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the topic', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockTopic]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTopic);
      const topic = await service.remove(topicId, topicId);
      expect(topic).toEqual(undefined);
    });
  });
});
