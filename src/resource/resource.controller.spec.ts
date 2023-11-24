import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockResource, mockResourceDto } from '../utils/mocks/resource.mock';
import { TopicService } from '../topic/topic.service';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { Resource } from './entities/resource.entity';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

describe('ResourceController', () => {
  let controller: ResourceController;
  let service: ResourceService;
  const { resourceId, ...result } = mockResource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceController],
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

    controller = module.get<ResourceController>(ResourceController);
    service = module.get<ResourceService>(ResourceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all resources', async () => {
      const expected: Resource[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll(resourceId)).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one resource', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockResource);
      expect(await controller.findOne(resourceId, resourceId)).toBe(
        mockResource,
      );
    });
  });

  describe('create', () => {
    it('Should create and return the resource', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockResource);
      expect(await controller.create(mockResourceDto, resourceId)).toBe(
        mockResource,
      );
    });
  });

  describe('update', () => {
    it('Should update and return the resource', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockResource);
      expect(
        await controller.update(resourceId, mockResourceDto, resourceId),
      ).toBe(mockResource);
    });
  });

  describe('delete', () => {
    it('Should remove one resource', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(resourceId, resourceId)).toBe(undefined);
    });
  });
});
