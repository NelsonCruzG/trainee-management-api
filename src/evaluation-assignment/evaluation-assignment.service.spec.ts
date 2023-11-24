import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
  MockSelectQueryBuilder,
} from '../utils/mocks/repository.mock';
import { EvaluationAssignmentService } from './evaluation-assignment.service';
import { EvaluationAssignment } from './entities/evaluation-assignment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AssignmentService } from '../assignment/assignment.service';
import { Assignment } from '../assignment/entities/assignment.entity';
import { ModuleService } from '../module/module.service';
import { UserService } from '../user/user.service';
import {
  mockEvaluationAssignment,
  mockSubmitHomework,
  mockQuizEvaluation,
} from '../utils/mocks/evaluation-assignment.mock';
import { mockUser } from '../utils/mocks/user.mock';
import { mockAssignment } from '../utils/mocks/assignment.mock';

describe('EvaluationAssignmentService', () => {
  let service: EvaluationAssignmentService;
  let assignmentService: AssignmentService;
  let userService: UserService;
  let repository: MockRepository;
  let selectBuilder: MockSelectQueryBuilder;
  const { evaluationAssignmentId, ...dto } = mockEvaluationAssignment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<EvaluationAssignmentService>(
      EvaluationAssignmentService,
    );

    userService = module.get<UserService>(UserService);

    assignmentService = module.get<AssignmentService>(AssignmentService);

    repository = module.get<MockRepository>(
      getRepositoryToken(EvaluationAssignment),
    );

    selectBuilder = createMockSelectQueryBuilder();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all evaluation assignments', async () => {
      const expectedEvaluationAssignments: EvaluationAssignment[] = [];

      repository.find.mockReturnValue(expectedEvaluationAssignments);
      const evaluationAssignments = await service.findAll();
      expect(evaluationAssignments).toEqual(expectedEvaluationAssignments);
    });
  });

  describe('findOne', () => {
    describe('When evaluation assignment exists', () => {
      it('Should return the evaluation assignment', async () => {
        repository.findOne.mockReturnValue(mockEvaluationAssignment);
        const evaluationAssignment = await service.findOne(
          evaluationAssignmentId,
        );
        expect(evaluationAssignment).toEqual(mockEvaluationAssignment);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        repository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(evaluationAssignmentId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Evaluation assignment with ID #${evaluationAssignmentId} not found`,
          );
        }
      });
    });
  });


  describe('submitHomework', () => {
    it('Should create and return the submitted homework assignment', async () => {
      repository.save.mockReturnValue(mockEvaluationAssignment);
      const { userId } = mockUser;
      jest
        .spyOn(userService, 'findOne')
        .mockImplementation(async () => mockUser);

      jest
        .spyOn(assignmentService, 'findOne')
        .mockImplementation(async () => mockAssignment);

      jest
        .spyOn(service, 'validateAssignment')
        .mockImplementation(async () => undefined);

      const submited = await service.submitHomework(userId, mockSubmitHomework);
      expect(submited).toEqual(mockEvaluationAssignment);
    });
  });

  describe('createQuizEvaluation', () => {
    it('Should create and return the submitted homework assignment', async () => {
      repository.save.mockReturnValue(mockEvaluationAssignment);
      const { userId } = mockUser;
      jest
        .spyOn(userService, 'findOne')
        .mockImplementation(async () => mockUser);

      jest
        .spyOn(assignmentService, 'findOne')
        .mockImplementation(async () => mockAssignment);

      jest
        .spyOn(service, 'validateAssignment')
        .mockImplementation(async () => undefined);

      const submited = await service.createQuizEvaluation(userId, mockQuizEvaluation);
      expect(submited).toEqual(mockEvaluationAssignment);
    });
  });

  describe('validateSubmit', () => {
    const { userId } = mockUser;
    const { assignmentId } = mockAssignment;

    describe('When a homework is already submited', () => {
      it('Should throw a bad request exception', async () => {
        repository.createQueryBuilder.mockReturnValue(selectBuilder);
        selectBuilder.leftJoinAndSelect.mockReturnValue(selectBuilder);
        selectBuilder.where.mockReturnValue(selectBuilder);
        selectBuilder.andWhere.mockReturnValue(selectBuilder);
        selectBuilder.getOne.mockResolvedValue(mockEvaluationAssignment);
        try {
          await service.validateAssignment(userId, assignmentId);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(`Evaluation already submitted`);
        }
      });
    });

    describe('Otherwise', () => {
      it('It should not throw any error', async () => {
        repository.createQueryBuilder.mockReturnValue(selectBuilder);
        selectBuilder.leftJoinAndSelect.mockReturnValue(selectBuilder);
        selectBuilder.where.mockReturnValue(selectBuilder);
        selectBuilder.andWhere.mockReturnValue(selectBuilder);
        selectBuilder.getOne.mockReturnValue(undefined);

        const result = await service.validateAssignment(userId, assignmentId);
        expect(result).toBe(undefined);
      });
    });
  });

  describe('update', () => {
    describe("If evaluation assignment doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(evaluationAssignmentId, dto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Evaluation assignment with ID #${evaluationAssignmentId} not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the evaluation assignment', async () => {
        repository.preload.mockReturnValue(mockEvaluationAssignment);
        repository.save.mockReturnValue(mockEvaluationAssignment);
        const evaluationAssignment = await service.update(
          evaluationAssignmentId,
          dto,
        );
        expect(evaluationAssignment).toEqual(mockEvaluationAssignment);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the evaluation assignment', async () => {
      repository.findOne.mockReturnValue(mockEvaluationAssignment);
      const evaluationAssignment = await service.remove(evaluationAssignmentId);
      expect(evaluationAssignment).toEqual(undefined);
    });
  });
});
