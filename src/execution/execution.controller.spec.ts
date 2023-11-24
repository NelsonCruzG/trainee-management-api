import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProgram } from '../utils/mocks/program.mocks';
import { Assignment } from '../assignment/entities/assignment.entity';
import { Item } from '../item/entities/item.entity';
import { ModuleEntity } from '../module/entities/module.entity';
import { Program } from '../program/entities/program.entity';
import { Resource } from '../resource/entities/resource.entity';
import { Rol } from '../rol/entities/rol.entity';
import { RolService } from '../rol/rol.service';
import { Topic } from '../topic/entities/topic.entity';
import { User } from '../user/entities/users.entity';
import { UserService } from '../user/user.service';
import { mockExecution, mockExecutionDto } from '../utils/mocks/execution.mock';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { Execution } from './entities/execution.entity';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { InheritanceService } from './inheritance/inheritance.service';
import { mockModuleEntity } from '../utils/mocks/module.mock';
import { mockTopic } from '../utils/mocks/topic.mock';
import { mockAssignment } from '../utils/mocks/assignment.mock';

describe('ExecutionController', () => {
  let controller: ExecutionController;
  let service: ExecutionService;
  const { executionId, ...dto } = mockExecution;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutionController],
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

    controller = module.get<ExecutionController>(ExecutionController);
    service = module.get<ExecutionService>(ExecutionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findTraineesByExecution', () => {
    it('Should return all trainees by execution', async () => {
      jest
        .spyOn(service, 'getTraineesByExecution')
        .mockResolvedValue(mockExecution);
      expect(
        await controller.findTraineesByExecution(executionId, executionId),
      ).toBe(mockExecution);
    });
  });

  describe('getExecutions', () => {
    it('Should return all executions by trainer', async () => {
      jest.spyOn(service, 'getExecutions').mockResolvedValue([mockExecution]);
      expect(await controller.getExecutions(executionId)).toEqual([
        mockExecution,
      ]);
    });
  });

  describe('getFullExecutions', () => {
    it('Should return all complete executions', async () => {
      jest
        .spyOn(service, 'getFullExecutions')
        .mockResolvedValue([mockExecution]);
      expect(await controller.getFullExecutions(executionId)).toEqual([
        mockExecution,
      ]);
    });
  });

  describe('getProgramsByExecutions', () => {
    it('Should return all programs by executions', async () => {
      jest
        .spyOn(service, 'getProgramsByExecutions')
        .mockResolvedValue([mockProgram]);
      expect(await controller.getProgramsByExecutions(executionId)).toEqual([
        mockProgram,
      ]);
    });
  });

  describe('getModulesByExecution', () => {
    it('Should return all modules by execution (program)', async () => {
      jest
        .spyOn(service, 'getModulesByExecution')
        .mockResolvedValue([mockModuleEntity]);
      expect(
        await controller.getModulesByExecution(executionId, executionId),
      ).toEqual([mockModuleEntity]);
    });
  });

  describe('getTopicsByExecution', () => {
    it('Should return all topics by execution (program)', async () => {
      jest
        .spyOn(service, 'getTopicsByExecution')
        .mockResolvedValue([mockTopic]);
      expect(
        await controller.getTopicsByExecution(
          executionId,
          executionId,
          executionId,
        ),
      ).toEqual([mockTopic]);
    });
  });

  describe('getResourcesByExecution', () => {
    it('Should return all resources by execution (program)', async () => {
      jest
        .spyOn(service, 'getResourcesByExecution')
        .mockResolvedValue([mockTopic]);
      expect(
        await controller.getResourcesByExecution(
          executionId,
          executionId,
          executionId,
        ),
      ).toEqual([mockTopic]);
    });
  });

  describe('getAssignmentByExecution', () => {
    it('Should return all assignment by execution (program)', async () => {
      jest
        .spyOn(service, 'getAssignmentByExecution')
        .mockResolvedValue([mockAssignment]);
      expect(
        await controller.getAssignmentByExecution(
          executionId,
          executionId,
          executionId,
        ),
      ).toEqual([mockAssignment]);
    });
  });

  describe('getAssignmentsByExecution', () => {
    it('Should return all assignment by execution (program)', async () => {
      jest
        .spyOn(service, 'getAssignmentsByExecution')
        .mockResolvedValue([mockModuleEntity]);
      expect(
        await controller.getAssignmentsByExecution(executionId, executionId),
      ).toEqual([mockModuleEntity]);
    });
  });

  describe('findExecutions', () => {
    it('Should return all executions', async () => {
      const expected: Execution[] = [];
      jest
        .spyOn(service, 'findExecutions')
        .mockImplementation(async () => expected);
      expect(await controller.findExecutions()).toBe(expected);
    });
  });

  describe('create', () => {
    it('Should create and return the execution', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockExecution);
      expect(await controller.create(mockExecutionDto)).toBe(mockExecution);
    });
  });

  describe('update', () => {
    it('Should update and return the execution', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockExecution);
      expect(await controller.update(executionId, dto)).toBe(mockExecution);
    });
  });
});
