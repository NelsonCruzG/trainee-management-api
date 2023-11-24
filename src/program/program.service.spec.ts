import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProgramDto, mockProgram } from '../utils/mocks/program.mocks';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { Program } from './entities/program.entity';
import { ProgramService } from './program.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/users.entity';
import { ExecutionService } from '../execution/execution.service';
import { Execution } from '../execution/entities/execution.entity';
import { RolService } from '../rol/rol.service';
import { Rol } from '../rol/entities/rol.entity';
import { mockUser } from '../utils/mocks/user.mock';
import { mockExecution } from '../utils/mocks/execution.mock';
import { InheritanceService } from '../execution/inheritance/inheritance.service';
import { ModuleEntity } from '../module/entities/module.entity';
import { Topic } from '../topic/entities/topic.entity';
import { Resource } from '../resource/entities/resource.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { Item } from '../item/entities/item.entity';

describe('ProgramService', () => {
  let service: ProgramService;
  let userService: UserService;
  let repository: MockRepository;
  const { programId, ...dto } = mockProgram;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ProgramService>(ProgramService);
    userService = module.get<UserService>(UserService);
    repository = module.get<MockRepository>(getRepositoryToken(Program));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all programs which are visible only for admin', async () => {
      const expectedPrograms: Program[] = [];
      repository.find.mockReturnValue(expectedPrograms);
      const programs = await service.findAll();
      expect(programs).toEqual(expectedPrograms);
    });
  });

  describe('findPrograms', () => {
    it('Should return all Programs', async () => {
      const expectedPrograms: Program[] = [];
      repository.find.mockReturnValue(expectedPrograms);
      const programs = await service.findPrograms();
      expect(programs).toEqual(expectedPrograms);
    });
  });

  describe('findOne', () => {
    describe('When program exists', () => {
      it('Should return the program', async () => {
        repository.findOne.mockReturnValue(mockProgram);
        const program = await service.findOne(programId);
        expect(program).toEqual(mockProgram);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        repository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(programId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Program with ID #${programId} not found`,
          );
        }
      });
    });
  });

  describe('findByName', () => {
    it('Should return the program', async () => {
      const { name } = mockProgram;
      repository.find.mockReturnValue(mockProgram);
      const program = await service.findByName(name);
      expect(program).toEqual(mockProgram);
    });
  });

  describe('createNewProgram', () => {
    describe('If program already exists', () => {
      it('Should throw a Bad request Exception', async () => {
        const { name } = mockProgram;
        repository.findOne.mockReturnValue(mockProgram);
        try {
          await service.createNewProgram(mockProgramDto);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(`Program: [${name}] already exists`);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should create and return the new program', async () => {
        jest
          .spyOn(userService, 'findUsersByRoles')
          .mockImplementation(async () => [mockUser]);
        repository.save.mockReturnValue(mockProgram);
        const program = await service.createNewProgram(mockProgramDto);
        expect(program).toEqual(mockProgram);
        expect(mockExecution).toBeDefined();
      });
    });
  });

  describe('update', () => {
    describe("If program doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(programId, dto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Program with ID #${programId} not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the program', async () => {
        repository.preload.mockReturnValue(mockProgram);
        repository.save.mockReturnValue(mockProgram);
        const program = await service.update(programId, dto);
        expect(program).toEqual(mockProgram);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the program', async () => {
      repository.findOne.mockReturnValue(mockProgram);
      const program = await service.remove(programId);
      expect(program).toEqual(undefined);
    });
  });

  describe('findOneParentById', () => {
    it('Should return the parent program', async () => {
      repository.findOne.mockReturnValue(mockProgram);
      const programExpected = await service.findOneParentById(programId);
      expect(programExpected).toEqual(mockProgram);
    });
  });

  describe('findOneByUser', () => {
    it('Should return one program by developer', async () => {
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnThis();
      selectBuilder.addSelect.mockReturnThis();
      selectBuilder.where.mockReturnThis();
      selectBuilder.getOne.mockReturnValue(mockProgram);
      const program = await service.findOneByUser(programId, programId);
      expect(program).toEqual(mockProgram);
    });
  });
});
