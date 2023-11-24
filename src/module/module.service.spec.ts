import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { ModuleService } from './module.service';
import { ModuleEntity } from './entities/module.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProgramService } from '../program/program.service';
import { mockModuleDto, mockModuleEntity } from '../utils/mocks/module.mock';
import { mockProgram } from '../utils/mocks/program.mocks';

describe('ModuleService', () => {
  let service: ModuleService;
  let repository: MockRepository;
  let programService: ProgramService;

  const { moduleId, ...dtoWithProgramId } = mockModuleEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleService,
        {
          provide: getRepositoryToken(ModuleEntity),
          useValue: createMockRepository(),
        },
        {
          provide: ProgramService,
          useValue: { findOneByUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ModuleService>(ModuleService);
    programService = module.get<ProgramService>(ProgramService);
    repository = module.get<MockRepository>(getRepositoryToken(ModuleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all Modules', async () => {
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnThis();
      selectBuilder.addSelect.mockReturnThis();
      selectBuilder.getMany.mockReturnValue([mockModuleEntity]);
      const modules = await service.findAll(moduleId);
      expect(modules).toEqual([mockModuleEntity]);
    });
  });

  describe('findOne', () => {
    describe('When module exists', () => {
      it('Should return the module', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockModuleEntity]);
        const module = await service.findOne(moduleId, moduleId);
        expect(module).toEqual(mockModuleEntity);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);
        try {
          await service.findOne(moduleId, moduleId);
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
        }
      });
    });
  });

  describe('create', () => {
    describe('If program parent is not null', () => {
      it('Should create and return the new module', async () => {
        jest
          .spyOn(programService, 'findOneByUser')
          .mockResolvedValue(mockProgram);

        repository.create.mockReturnValue(mockModuleEntity);
        repository.save.mockReturnValue(mockModuleEntity);
        const module = await service.create(mockModuleDto, moduleId);
        expect(module).toEqual(mockModuleEntity);
      });
    });

    describe('If program parent is null', () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(programService, 'findOneByUser').mockReturnValue(undefined);

        try {
          await service.create(mockModuleDto, moduleId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Program with ID #${moduleId} not found`);
        }
      });
    });
  });

  describe('update', () => {
    describe("If module doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);
        jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(moduleId, mockModuleDto, moduleId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Module with ID #${moduleId} not found`);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the module', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockModuleEntity]);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockModuleEntity);
        repository.preload.mockReturnValue(mockModuleEntity);
        repository.save.mockReturnValue(mockModuleEntity);
        const module = await service.update(moduleId, mockModuleDto, moduleId);
        expect(module).toEqual(mockModuleEntity);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the module', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockModuleEntity]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockModuleEntity);
      const module = await service.remove(moduleId, moduleId);
      expect(module).toEqual(undefined);
    });
  });
});
