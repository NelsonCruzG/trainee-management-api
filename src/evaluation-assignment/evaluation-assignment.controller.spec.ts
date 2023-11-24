import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignmentService } from '../assignment/assignment.service';
import { Assignment } from '../assignment/entities/assignment.entity';
import { ModuleService } from '../module/module.service';
import { UserService } from '../user/user.service';
import {
  mockEvaluationAssignment,
  mockSubmitHomework,
} from '../utils/mocks/evaluation-assignment.mock';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { EvaluationAssignment } from './entities/evaluation-assignment.entity';
import { EvaluationAssignmentController } from './evaluation-assignment.controller';
import { EvaluationAssignmentService } from './evaluation-assignment.service';
import { mockUser } from '../utils/mocks/user.mock';
import { mockQuizEvaluation } from '../utils/mocks/evaluation-assignment.mock';

describe('EvaluationAssignmentController', () => {
  let controller: EvaluationAssignmentController;
  let service: EvaluationAssignmentService;
  const { evaluationAssignmentId, ...dto } = mockEvaluationAssignment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationAssignmentController],
      providers: [
        EvaluationAssignmentService,
        AssignmentService,
        {
          provide: getRepositoryToken(EvaluationAssignment),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Assignment),
          useValue: createMockRepository(),
        },
        {
          provide: ModuleService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: UserService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<EvaluationAssignmentController>(
      EvaluationAssignmentController,
    );
    service = module.get<EvaluationAssignmentService>(
      EvaluationAssignmentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all evaluation assignments', async () => {
      const expected: EvaluationAssignment[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll()).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one evaluation assignment', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockEvaluationAssignment);
      expect(await controller.findOne(evaluationAssignmentId)).toBe(
        mockEvaluationAssignment,
      );
    });
  });

  describe('submitHomework', () => {
    it('Should create and return the submitted homework assignment evaluation', async () => {
      const { userId } = mockUser;
      jest
        .spyOn(service, 'submitHomework')
        .mockImplementation(async () => mockEvaluationAssignment);
      expect(await controller.submitHomework(userId, mockSubmitHomework)).toBe(
        mockEvaluationAssignment,
      );
    });
  });

  describe('createQuizEvaluation', () => {
    it('Should create and return the new evaluation for the quiz', async () => {
      const { userId } = mockUser;
      jest
        .spyOn(service, 'createQuizEvaluation')
        .mockImplementation(async () => mockEvaluationAssignment);
      expect(await controller.createQuizEvaluation(userId, mockQuizEvaluation)).toBe(
        mockEvaluationAssignment,
      );
    });
  });

  describe('update', () => {
    it('Should update and return the evaluation assignment', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockEvaluationAssignment);
      expect(await controller.update(evaluationAssignmentId, dto)).toBe(
        mockEvaluationAssignment,
      );
    });
  });

  describe('delete', () => {
    it('Should remove one evaluation assignment', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(evaluationAssignmentId)).toBe(undefined);
    });
  });
});
