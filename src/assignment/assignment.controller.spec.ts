import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockAssignment,
  mockAssignmentDto,
} from '../utils/mocks/assignment.mock';
import { ModuleService } from '../module/module.service';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { Assignment } from './entities/assignment.entity';

describe('AssignmentController', () => {
  let controller: AssignmentController;
  let service: AssignmentService;
  const { assignmentId, ...result } = mockAssignment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(Assignment),
          useValue: createMockRepository(),
        },
        {
          provide: ModuleService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
    service = module.get<AssignmentService>(AssignmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all assignments', async () => {
      const expected: Assignment[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll(assignmentId)).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one assignment', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockAssignment);
      expect(await controller.findOne(assignmentId, assignmentId)).toBe(
        mockAssignment,
      );
    });
  });

  describe('create', () => {
    it('Should create and return the assignment', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockAssignment);
      expect(await controller.create(mockAssignmentDto, assignmentId)).toBe(
        mockAssignment,
      );
    });
  });

  describe('update', () => {
    it('Should update and return the assignment', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockAssignment);
      expect(
        await controller.update(assignmentId, mockAssignmentDto, assignmentId),
      ).toBe(mockAssignment);
    });
  });

  describe('delete', () => {
    it('Should remove one assignment', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(assignmentId, assignmentId)).toBe(
        undefined,
      );
    });
  });
});
