import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from '../assignment/entities/assignment.entity';
import { Execution } from '../execution/entities/execution.entity';
import { ExecutionService } from '../execution/execution.service';
import { InheritanceService } from '../execution/inheritance/inheritance.service';
import { Item } from '../item/entities/item.entity';
import { ModuleEntity } from '../module/entities/module.entity';
import { Resource } from '../resource/entities/resource.entity';
import { Rol } from '../rol/entities/rol.entity';
import { RolService } from '../rol/rol.service';
import { Topic } from '../topic/entities/topic.entity';
import { User } from '../user/entities/users.entity';
import { UserService } from '../user/user.service';
import { mockProgram, mockProgramDto } from '../utils/mocks/program.mocks';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { Program } from './entities/program.entity';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

describe('ProgramController', () => {
  let controller: ProgramController;
  let service: ProgramService;
  const { programId, ...dto } = mockProgram;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramController],
      providers: [
        ProgramService,
        ExecutionService,
        InheritanceService,
        UserService,
        RolService,
        {
          provide: getRepositoryToken(Execution),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Program),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Rol),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ModuleEntity),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Topic),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Resource),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Assignment),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Item),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<ProgramController>(ProgramController);
    service = module.get<ProgramService>(ProgramService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findPrograms', () => {
    it('Should return all programs', async () => {
      const expected: Program[] = [];
      jest
        .spyOn(service, 'findPrograms')
        .mockImplementation(async () => expected);
      expect(await controller.findPrograms()).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one programs', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockProgram);
      expect(await controller.findOne(programId)).toBe(mockProgram);
    });
  });

  describe('create', () => {
    it('Should create and return the program', async () => {
      jest
        .spyOn(service, 'createNewProgram')
        .mockImplementation(async () => mockProgram);
      expect(await controller.create(mockProgramDto)).toBe(mockProgram);
    });
  });

  describe('update', () => {
    it('Should update and return the program', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => mockProgram);
      expect(await controller.update(programId, dto)).toBe(mockProgram);
    });
  });

});
