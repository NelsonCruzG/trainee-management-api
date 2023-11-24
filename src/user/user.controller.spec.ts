import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Execution } from '../execution/entities/execution.entity';
import { Rol } from '../rol/entities/rol.entity';
import { RolService } from '../rol/rol.service';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { mockEmployee, mockTrainee, mockUser } from '../utils/mocks/user.mock';
import { User } from './entities/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const { userId, ...dto } = mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAllEmployees', () => {
    it('Should return all employees', async () => {
      const expected: User[] = [];
      jest
        .spyOn(service, 'findAllEmployees')
        .mockImplementation(async () => expected);
      expect(await controller.findAllEmployees()).toBe(expected);
    });
  });

  describe('findAllTrainees', () => {
    it('Should return all trainees', async () => {
      const expected: User[] = [];
      jest
        .spyOn(service, 'findAllTrainees')
        .mockImplementation(async () => expected);
      expect(await controller.findAllTrainees()).toBe(expected);
    });
  });

  describe('createEmployee', () => {
    it('Should create and return the employee', async () => {
      jest
        .spyOn(service, 'createEmployee')
        .mockImplementation(async () => mockUser);
      expect(await controller.createEmployee(mockEmployee)).toBe(mockUser);
    });
  });

  describe('findOne', () => {
    it('Should return one User', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockUser);
      expect(await controller.findOne(userId)).toBe(mockUser);
    });
  });

  describe('createTrainee', () => {
    it('Should create and return the new trainee', async () => {
      jest
        .spyOn(service, 'createTrainee')
        .mockImplementation(async () => mockUser);
      expect(await controller.createTrainee(mockTrainee)).toBe(mockUser);
    });
  });

  describe('update', () => {
    it('Should update and return the User', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => mockUser);
      expect(await controller.update(userId, dto)).toBe(mockUser);
    });
  });

  describe('updateEmployee', () => {
    it('Should update and return the Employee', async () => {
      jest
        .spyOn(service, 'updateEmployee')
        .mockImplementation(async () => mockUser);
      expect(await controller.updateEmployee(userId, mockEmployee)).toBe(
        mockUser,
      );
    });
  });

  describe('delete', () => {
    it('Should remove one User', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(userId)).toBe(undefined);
    });
  });
});
