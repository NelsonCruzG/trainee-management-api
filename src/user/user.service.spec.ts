import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  createMockRepository,
  MockRepository,
  MockSelectQueryBuilder,
  createMockSelectQueryBuilder,
} from '../utils/mocks/repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Rol } from '../rol/entities/rol.entity';
import { RolService } from '../rol/rol.service';
import { mockEmployee, mockTrainee, mockUser } from '../utils/mocks/user.mock';
import { Execution } from '../execution/entities/execution.entity';
import { mockExecution } from '../utils/mocks/execution.mock';

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository;
  let executionRepository: MockRepository;
  let selectQueryBuilder: MockSelectQueryBuilder;
  const { userId, email, ...dto } = mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        RolService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Rol),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Execution),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockRepository>(getRepositoryToken(User));
    executionRepository = module.get<MockRepository>(
      getRepositoryToken(Execution),
    );
    selectQueryBuilder = createMockSelectQueryBuilder();
  });

  describe('findOne', () => {
    describe('When user exists', () => {
      it('Should return user', async () => {
        repository.findOne.mockReturnValue(mockUser);
        const user = await service.findOne(userId);
        expect(user).toEqual(mockUser);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        repository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID #${userId} not found`);
        }
      });
    });
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllEmployees', () => {
    it('Should return all employees', async () => {
      const expectedUsers: User[] = [];
      repository.createQueryBuilder.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.leftJoinAndSelect.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.leftJoin.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.where.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.getMany.mockReturnValue(expectedUsers);

      const employees = await service.findAllEmployees();
      expect(employees).toEqual(expectedUsers);
    });
  });

  describe('findAllTrainees', () => {
    it('Should return all trainees', async () => {
      const expectedUsers: User[] = [];
      repository.createQueryBuilder.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.leftJoinAndSelect.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.leftJoin.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.where.mockReturnValue(selectQueryBuilder);
      selectQueryBuilder.getMany.mockReturnValue(expectedUsers);

      const employees = await service.findAllTrainees();
      expect(employees).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    describe('When user exists', () => {
      it('Should return user', async () => {
        repository.findOne.mockReturnValue(mockUser);
        const user = await service.findOne(userId);
        expect(user).toEqual(mockUser);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        repository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID #${userId} not found`);
        }
      });
    });
  });

  describe('findOneByEmail', () => {
    it('Should return a user', async () => {
      repository.findOne.mockReturnValue(mockUser);
      const user = await service.findOneByEmail(email);
      expect(user).toEqual(mockUser);
    });
  });

  describe('validateEmail', () => {
    describe('If email already exists', () => {
      it('Should throw a BadRequest Exception', async () => {
        repository.findOne.mockReturnValue(mockUser);
        try {
          await service.validateEmail(email);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(
            `User with email: [${email}] already exists`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should end execution', async () => {
        repository.findOne.mockReturnValue(undefined);
        expect(await service.validateEmail(email)).toEqual(undefined);
      });
    });
  });

  describe('createEmployee', () => {
    it('Should create and return the new employee', async () => {
      repository.save.mockReturnValue(mockUser);
      const user = await service.createEmployee(mockEmployee);
      expect(user).toEqual(mockUser);
    });
  });

  describe('createTrainee', () => {
    describe("If specified execution doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        const executionId = 1;
        executionRepository.findOne.mockReturnValue(undefined);
        try {
          await service.createTrainee(mockTrainee);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Execution with ID #${executionId} not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should create and return the new trainee', async () => {
        executionRepository.findOne.mockReturnValue(mockExecution);
        repository.save.mockReturnValue(mockUser);
        const user = await service.createTrainee(mockTrainee);
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('update', () => {
    describe("If user doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(userId, dto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID #${userId} not found`);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the User', async () => {
        repository.preload.mockReturnValue(mockUser);
        repository.save.mockReturnValue(mockUser);
        const user = await service.update(userId, dto);
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('updateEmployee', () => {
    describe("If employee doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        repository.preload.mockReturnValue(undefined);
        try {
          await service.updateEmployee(userId, mockEmployee);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Employee with ID #${userId} not found`);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the employee', async () => {
        repository.preload.mockReturnValue(mockUser);
        repository.save.mockReturnValue(mockUser);
        const employee = await service.updateEmployee(userId, mockEmployee);
        expect(employee).toEqual(mockUser);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the User', async () => {
      repository.findOne.mockReturnValue(mockUser);
      const user = await service.remove(userId);
      expect(user).toEqual(undefined);
    });
  });
});
