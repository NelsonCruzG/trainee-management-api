import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProgramService } from '../program/program.service';
import { mockModuleEntity, mockModuleDto } from '../utils/mocks/module.mock';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { ModuleEntity } from './entities/module.entity';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

describe('ModuleController', () => {
  let controller: ModuleController;
  let service: ModuleService;

  const { moduleId, ...result } = mockModuleEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleController],
      providers: [
        ModuleService,
        {
          provide: getRepositoryToken(ModuleEntity),
          useValue: createMockRepository(),
        },
        {
          provide: ProgramService,
          useValue: { findOneParentById: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ModuleController>(ModuleController);
    service = module.get<ModuleService>(ModuleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all modules', async () => {
      const expected: ModuleEntity[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll(moduleId)).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one module', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockModuleEntity);
      expect(await controller.findOne(moduleId, moduleId)).toBe(
        mockModuleEntity,
      );
    });
  });

  describe('create', () => {
    it('Should create and return the Module', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockModuleEntity);
      expect(await controller.create(mockModuleDto, moduleId)).toBe(
        mockModuleEntity,
      );
    });
  });

  describe('update', () => {
    it('Should update and return the Module', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockModuleEntity);
      expect(await controller.update(moduleId, mockModuleDto, moduleId)).toBe(
        mockModuleEntity,
      );
    });
  });

  describe('delete', () => {
    it('Should remove one Module', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(moduleId, moduleId)).toBe(undefined);
    });
  });
});
