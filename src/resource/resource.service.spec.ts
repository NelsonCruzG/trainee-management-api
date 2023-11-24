import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockResource, mockResourceDto } from '../utils/mocks/resource.mock';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { Resource } from './entities/resource.entity';
import { ResourceService } from './resource.service';
import { TopicService } from '../topic/topic.service';
import { mockTopic } from '../utils/mocks/topic.mock';

describe('ResourceService', () => {
  let service: ResourceService;
  let topicService: TopicService;
  let repository: MockRepository;

  const { resourceId, ...result } = mockResource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: getRepositoryToken(Resource),
          useValue: createMockRepository(),
        },
        {
          provide: TopicService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    topicService = module.get<TopicService>(TopicService);

    repository = module.get<MockRepository>(getRepositoryToken(Resource));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all resources', async () => {
      const expectedResources: Resource[] = [];
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnValue(selectBuilder);
      selectBuilder.addSelect.mockReturnValue(selectBuilder);
      selectBuilder.getMany.mockReturnValue(expectedResources);
      const resources = await service.findAll(resourceId);
      expect(resources).toEqual(expectedResources);
    });
  });

  describe('findOne', () => {
    describe('When resource exists', () => {
      it('Should return the resource', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockResource]);
        const resource = await service.findOne(resourceId, resourceId);
        expect(resource).toEqual(mockResource);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);

        try {
          await service.findOne(resourceId, resourceId);
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
        }
      });
    });
  });

  describe('create', () => {
    describe('If topic is not null', () => {
      it('Should create and return the new resource', async () => {
        jest.spyOn(topicService, 'findOne').mockResolvedValue(mockTopic);

        repository.create.mockReturnValue(mockResource);
        repository.save.mockReturnValue(mockResource);
        const resource = await service.create(mockResourceDto, resourceId);
        expect(resource).toEqual(mockResource);
      });
    });

    describe('If topic is null', () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(topicService, 'findOne').mockResolvedValue(undefined);

        try {
          await service.create(mockResourceDto, resourceId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Topic with ID #${resourceId} not found`);
        }
      });
    });
  });

  describe('update', () => {
    describe("If resource doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);
        jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(resourceId, mockResourceDto, resourceId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Resource with ID #${resourceId} not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the resource', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockResource]);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockResource);
        repository.preload.mockReturnValue(mockResource);
        repository.save.mockReturnValue(mockResource);
        const resource = await service.update(
          resourceId,
          mockResourceDto,
          resourceId,
        );
        expect(resource).toEqual(mockResource);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the resource', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockResource]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockResource);
      const resource = await service.remove(resourceId, resourceId);
      expect(resource).toEqual(undefined);
    });
  });
});
