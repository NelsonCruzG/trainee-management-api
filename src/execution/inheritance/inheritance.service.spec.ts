import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { ModuleEntity } from '../../module/entities/module.entity';
import { Program } from '../../program/entities/program.entity';
import { Resource } from '../../resource/entities/resource.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { RolService } from '../../rol/rol.service';
import { Topic } from '../../topic/entities/topic.entity';
import { User } from '../../user/entities/users.entity';
import { UserService } from '../../user/user.service';
import {
  mockExecutionDto,
  mockExecution,
} from '../../utils/mocks/execution.mock';
import { mockProgram } from '../../utils/mocks/program.mocks';
import {
  createMockRepository,
  MockRepository,
} from '../../utils/mocks/repository.mock';
import { InheritanceService } from './inheritance.service';
import { Item } from '../../item/entities/item.entity';
import { mockModuleEntity } from '../../utils/mocks/module.mock';
import { mockTopic } from '../../utils/mocks/topic.mock';
import { mockAssignment } from '../../utils/mocks/assignment.mock';
import { mockResource } from '../../utils/mocks/resource.mock';
import { mockItem } from '../../utils/mocks/item.mock';
import { mockUser } from '../../utils/mocks/user.mock';
import { Execution } from '../entities/execution.entity';

describe('InheritanceService', () => {
  let service: InheritanceService;
  let userService: UserService;
  let programRepository: MockRepository;
  let modulesRepository: MockRepository;
  let topicsRepository: MockRepository;
  let assignmentsRepository: MockRepository;
  let resourcesRepository: MockRepository;
  let itemsRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InheritanceService,
        UserService,
        RolService,
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
        {
          provide: getRepositoryToken(Execution),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<InheritanceService>(InheritanceService);
    userService = module.get<UserService>(UserService);
    programRepository = module.get<MockRepository>(getRepositoryToken(Program));
    modulesRepository = module.get<MockRepository>(
      getRepositoryToken(ModuleEntity),
    );
    topicsRepository = module.get<MockRepository>(getRepositoryToken(Topic));
    assignmentsRepository = module.get<MockRepository>(
      getRepositoryToken(Assignment),
    );
    resourcesRepository = module.get<MockRepository>(
      getRepositoryToken(Resource),
    );
    itemsRepository = module.get<MockRepository>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTrainers', () => {
    it('Should return users array of rol type: Trainer', async () => {
      const expected: User[] = [mockUser];
      const idsList: number[] = [1];
      jest
        .spyOn(userService, 'findUsersByRoles')
        .mockImplementation(async () => expected);

      const trainers = await service.getTrainers(idsList);
      expect(trainers).toEqual(expected);
    });
  });

  describe('getProgram', () => {
    const { programName } = mockExecutionDto;
    it('Should return the program by name', async () => {
      programRepository.findOne.mockReturnValue(mockProgram);
      const expected: ModuleEntity[] = [];

      jest
        .spyOn(service, 'getModules')
        .mockImplementation(async () => expected);

      const program = await service.getProgram(programName, null);
      expect(program).toEqual(mockProgram);
    });
  });

  describe('inheritProgram', () => {
    describe('When the copy is not equal to the original', () => {
      it('Should create a new copy of the original', async () => {
        const expected = false;
        jest
          .spyOn(service, 'comparePrograms')
          .mockImplementation(() => expected);

        programRepository.create.mockReturnValue(mockProgram);
        const result = await service.inheritProgram(mockProgram, mockExecution);
        expect(result).toEqual(undefined);
      });
    });

    describe('Otherwise', () => {
      it('Should add the execution to the last copy', async () => {
        const expected = true;
        jest
          .spyOn(service, 'getProgram')
          .mockImplementation(async () => mockProgram);

        jest
          .spyOn(service, 'comparePrograms')
          .mockImplementation(() => expected);

        programRepository.create.mockReturnValue(mockProgram);
        const result = await service.inheritProgram(mockProgram, mockExecution);
        expect(result).toEqual(undefined);
      });
    });
  });

  describe('getModules', () => {
    it('Should return the modules of a specific program', async () => {
      const modules = [mockModuleEntity];
      const topics = [mockTopic];
      const assignments = [mockAssignment];

      modulesRepository.find.mockReturnValue(modules);
      jest.spyOn(service, 'getTopics').mockImplementation(async () => topics);

      jest
        .spyOn(service, 'getAssignments')
        .mockImplementation(async () => assignments);

      const result = await service.getModules(mockProgram);
      expect(result).toEqual(modules);
    });
  });

  describe('getTopics', () => {
    it('Should return the topics of a specific module', async () => {
      const topics = [mockTopic];
      const resources = [mockResource];

      topicsRepository.find.mockReturnValue(topics);
      jest
        .spyOn(service, 'getResources')
        .mockImplementation(async () => resources);

      const result = await service.getTopics(mockModuleEntity);
      expect(result).toEqual(topics);
    });
  });

  describe('getResources', () => {
    it('Should return the resources of a specific topic', async () => {
      const resources = [mockResource];
      resourcesRepository.find.mockReturnValue(resources);
      const result = await service.getResources(mockTopic);
      expect(result).toEqual(resources);
    });
  });

  describe('getAssignments', () => {
    it('Should return the assignments of a specific module', async () => {
      const assignments = [mockAssignment];
      const items = [mockItem];

      assignmentsRepository.find.mockReturnValue(assignments);
      jest.spyOn(service, 'getItems').mockImplementation(async () => items);

      const result = await service.getAssignments(mockModuleEntity);
      expect(result).toEqual(assignments);
    });
  });

  describe('getItems', () => {
    it('Should return the items of a specific assignment', async () => {
      const items = [mockItem];
      itemsRepository.find.mockReturnValue(items);
      const result = await service.getItems(mockAssignment);
      expect(result).toEqual(items);
    });
  });

  describe('getMyProgram', () => {
    it('Should return a specific program', async () => {
      programRepository.findOne.mockReturnValue(mockProgram);
      const result = await service.getMyProgram(expect.any(Number));
      expect(result).toEqual(mockProgram);
    });
  });

  describe('getMyModules', () => {
    it('Should return modules of a specific program', async () => {
      modulesRepository.find.mockReturnValue([mockModuleEntity]);
      const result = await service.getMyModules(mockProgram);
      expect(result).toEqual([mockModuleEntity]);
    });
  });

  describe('getMyTopics', () => {
    it('Should return topics of a specific module', async () => {
      topicsRepository.find.mockReturnValue([mockTopic]);
      const result = await service.getMyTopics(mockModuleEntity);
      expect(result).toEqual([mockTopic]);
    });
  });

  describe('getMyAssignments', () => {
    it('Should return assignments of a specific module', async () => {
      assignmentsRepository.find.mockReturnValue([mockAssignment]);
      const result = await service.getMyAssignments(mockModuleEntity);
      expect(result).toEqual([mockAssignment]);
    });
  });
});
