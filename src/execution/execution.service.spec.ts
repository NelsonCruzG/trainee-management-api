import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { ExecutionService } from './execution.service';
import { Execution } from './entities/execution.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  mockExecution,
  mockManagerDto,
  mockExecutionDto,
} from '../utils/mocks/execution.mock';
import { User } from '../user/entities/users.entity';
import { Program } from '../program/entities/program.entity';
import { RolService } from '../rol/rol.service';
import { Rol } from '../rol/entities/rol.entity';
import { mockProgram } from '../utils/mocks/program.mocks';
import { InheritanceService } from './inheritance/inheritance.service';
import { ModuleEntity } from '../module/entities/module.entity';
import { Topic } from '../topic/entities/topic.entity';
import { Resource } from '../resource/entities/resource.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { Item } from '../item/entities/item.entity';
import { mockUser } from '../utils/mocks/user.mock';
import { mockModuleEntity } from '../utils/mocks/module.mock';
import { mockTopic } from '../utils/mocks/topic.mock';
import { mockAssignment } from '../utils/mocks/assignment.mock';

describe('ExecutionService', () => {
  let service: ExecutionService;
  let inheritanceService: InheritanceService;
  let repository: MockRepository;
  const { executionId, ...dto } = mockExecution;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<ExecutionService>(ExecutionService);
    inheritanceService = module.get<InheritanceService>(InheritanceService);
    repository = module.get<MockRepository>(getRepositoryToken(Execution));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findExecutions', () => {
    it('Should return all executions', async () => {
      const expectedExecutions: Execution[] = [];
      repository.find.mockReturnValue(expectedExecutions);
      const executions = await service.findExecutions();
      expect(executions).toEqual(expectedExecutions);
    });
  });

  describe('findAll', () => {
    it('Should return all only admin visible executions', async () => {
      const expectedExecutions: Execution[] = [];
      repository.find.mockReturnValue(expectedExecutions);
      const executions = await service.findAll();
      expect(executions).toEqual(expectedExecutions);
    });
  });

  describe('getTraineesByExecution', () => {
    describe('If execution is not null', () => {
      it('Should return all trainees by execution', async () => {
        const selectBuilder = createMockSelectQueryBuilder();
        repository.createQueryBuilder.mockReturnValue(selectBuilder);
        selectBuilder.innerJoinAndSelect.mockReturnThis();
        selectBuilder.innerJoin.mockReturnThis();
        selectBuilder.where.mockReturnThis();
        selectBuilder.getOne.mockResolvedValue(mockExecution);
        const execution = await service.getTraineesByExecution(
          executionId,
          executionId,
        );
        expect(execution).toEqual(mockExecution);
      });
    });

    describe('If execution is null', () => {
      it('Should return throw a Not found exception', async () => {
        const selectBuilder = createMockSelectQueryBuilder();
        repository.createQueryBuilder.mockReturnValue(selectBuilder);
        selectBuilder.innerJoinAndSelect.mockReturnThis();
        selectBuilder.innerJoin.mockReturnThis();
        selectBuilder.where.mockReturnThis();

        try {
          selectBuilder.getOne.mockResolvedValue(undefined);
          await service.getTraineesByExecution(executionId, executionId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Execution with ID #${executionId} not found`,
          );
        }
      });
    });
  });

  describe('getFullExecutions', () => {
    it('Should return all complete executions', async () => {
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.leftJoinAndSelect.mockReturnThis();
      selectBuilder.leftJoin.mockReturnThis();
      selectBuilder.where.mockReturnThis();
      selectBuilder.andWhere.mockReturnThis();
      selectBuilder.getMany.mockResolvedValue([mockExecution]);
      const execution = await service.getFullExecutions(executionId);
      expect(execution).toEqual([mockExecution]);
    });
  });

  describe('getExecutions', () => {
    it('Should return all executions by trainer', async () => {
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnThis();
      selectBuilder.addSelect.mockReturnThis();
      selectBuilder.getMany.mockResolvedValue([mockExecution]);
      const executions = await service.getExecutions(executionId);
      expect(executions).toEqual([mockExecution]);
    });
  });

  describe('getProgramsByExecutions', () => {
    it('Should return all executions by trainer', async () => {
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnThis();
      selectBuilder.addSelect.mockReturnThis();
      selectBuilder.getMany.mockResolvedValue([mockExecution]);
      const executions = await service.getExecutions(executionId);
      jest
        .spyOn(inheritanceService, 'getMyProgram')
        .mockResolvedValue(mockProgram);

      const programs = await service.getProgramsByExecutions(executionId);
      expect(programs).toEqual([mockProgram]);
      expect(executions).toEqual([mockExecution]);
    });
  });

  describe('getModulesByExecution', () => {
    it('Should return all modules by execution (program)', async () => {
      jest
        .spyOn(service, 'getProgramsByExecutions')
        .mockResolvedValue([mockProgram]);

      jest
        .spyOn(inheritanceService, 'getMyModules')
        .mockResolvedValue([mockModuleEntity]);

      const modules = await service.getModulesByExecution(
        executionId,
        executionId,
      );
      expect(modules).toEqual([mockModuleEntity]);
    });
  });

  describe('getTopicsByExecution', () => {
    it('Should return all topics by execution (program)', async () => {
      jest
        .spyOn(service, 'getModulesByExecution')
        .mockResolvedValue([mockModuleEntity]);

      jest
        .spyOn(inheritanceService, 'getMyTopics')
        .mockResolvedValue([mockTopic]);

      const topics = await service.getTopicsByExecution(
        executionId,
        executionId,
        executionId,
      );
      expect(topics).toEqual([mockTopic]);
    });
  });

  describe('getAssignmentByExecution', () => {
    it('Should return all assignments by execution (program)', async () => {
      jest
        .spyOn(service, 'getModulesByExecution')
        .mockResolvedValue([mockModuleEntity]);

      jest
        .spyOn(inheritanceService, 'getMyAssignments')
        .mockResolvedValue([mockAssignment]);

      const assignments = await service.getAssignmentByExecution(
        executionId,
        executionId,
        executionId,
      );
      expect(assignments).toEqual([mockAssignment]);
    });
  });

  describe('getResourcesByExecution', () => {
    it('Should return all resources by execution (program)', async () => {
      jest
        .spyOn(service, 'getModulesByExecution')
        .mockResolvedValue([mockModuleEntity]);

      jest
        .spyOn(inheritanceService, 'getTopics')
        .mockResolvedValue([mockTopic]);

      const topics = await service.getResourcesByExecution(
        executionId,
        executionId,
        executionId,
      );
      expect(topics).toEqual([mockTopic]);
    });
  });

  describe('getAssignmentsByExecution', () => {
    it('Should return all assignments by execution (program)', async () => {
      jest
        .spyOn(service, 'getModulesByExecution')
        .mockResolvedValue([mockModuleEntity]);

      jest
        .spyOn(inheritanceService, 'getMyAssignments')
        .mockResolvedValue([mockAssignment]);

      const modules = await service.getAssignmentsByExecution(
        executionId,
        executionId,
      );
      expect(modules).toEqual([mockModuleEntity]);
    });
  });

  describe('create', () => {
    const expected = [mockUser];
    const { programName } = mockExecutionDto;
    describe("If the specified program doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        jest
          .spyOn(inheritanceService, 'getTrainers')
          .mockImplementation(async () => expected);

        jest
          .spyOn(inheritanceService, 'getProgram')
          .mockImplementation(async () => undefined);
        try {
          await service.create(mockExecutionDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Program with name: [${programName}] not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should create and return the new execution', async () => {
        jest
          .spyOn(inheritanceService, 'getTrainers')
          .mockImplementation(async () => expected);

        jest
          .spyOn(inheritanceService, 'getProgram')
          .mockImplementation(async () => mockProgram);

        repository.save.mockReturnValue(mockExecution);
        const execution = await service.create(mockExecutionDto);
        expect(execution).toEqual(mockExecution);
      });
    });
  });

  describe('createManager', () => {
    it('Should create and return a new execution-program manager', async () => {
      repository.save.mockReturnValue(mockExecution);
      const execution = await service.createManager(mockManagerDto);
      expect(execution).toEqual(mockExecution);
    });
  });

  describe('update', () => {
    describe("If execution doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(executionId, dto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Execution with ID #${executionId} not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the execution', async () => {
        repository.preload.mockReturnValue(mockExecution);
        repository.save.mockReturnValue(mockExecution);
        const execution = await service.update(executionId, dto);
        expect(execution).toEqual(mockExecution);
      });
    });
  });
});
