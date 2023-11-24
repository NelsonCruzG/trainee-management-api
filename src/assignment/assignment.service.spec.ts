import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockAssignment,
  mockAssignmentDto,
} from '../utils/mocks/assignment.mock';
import { ModuleService } from '../module/module.service';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { AssignmentService } from './assignment.service';
import { Assignment } from './entities/assignment.entity';
import { mockModuleEntity } from '../utils/mocks/module.mock';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let moduleService: ModuleService;
  let repository: MockRepository;
  const { assignmentId, ...result } = mockAssignment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AssignmentService>(AssignmentService);
    moduleService = module.get<ModuleService>(ModuleService);
    repository = module.get<MockRepository>(getRepositoryToken(Assignment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all assignments', async () => {
      const expectedAssignments: Assignment[] = [];
      const selectBuilder = createMockSelectQueryBuilder();

      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnValue(selectBuilder);
      selectBuilder.addSelect.mockReturnValue(selectBuilder);
      selectBuilder.getMany.mockReturnValue(expectedAssignments);
      const assignments = await service.findAll(assignmentId);
      expect(assignments).toEqual(expectedAssignments);
    });
  });

  describe('findOne', () => {
    describe('When assignment exists', () => {
      it('Should return the assignment', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockAssignment]);
        const assignment = await service.findOne(assignmentId, assignmentId);
        expect(assignment).toEqual(mockAssignment);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);

        try {
          await service.findOne(undefined, undefined);
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
        }
      });
    });
  });

  describe('create', () => {
    describe('If module is not null', () => {
      it('Should create and return the new topic', async () => {
        jest
          .spyOn(moduleService, 'findOne')
          .mockResolvedValue(mockModuleEntity);

        repository.create.mockReturnValue(mockAssignment);
        repository.save.mockReturnValue(mockAssignment);
        const module = await service.create(mockAssignmentDto, assignmentId);
        expect(module).toEqual(mockAssignment);
      });
    });

    describe('If module is null', () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(moduleService, 'findOne').mockResolvedValue(undefined);

        try {
          await service.create(mockAssignmentDto, assignmentId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Module with ID #${assignmentId} not found`,
          );
        }
      });
    });
  });

  describe('update', () => {
    describe("If assignment doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);
        jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(assignmentId, mockAssignmentDto, assignmentId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Assignment with ID #${assignmentId} not found`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the assignment', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockAssignment]);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockAssignment);
        repository.preload.mockReturnValue(mockAssignment);
        repository.save.mockReturnValue(mockAssignment);
        const assignment = await service.update(
          assignmentId,
          mockAssignmentDto,
          assignmentId,
        );
        expect(assignment).toEqual(mockAssignment);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the assignment', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockAssignment]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAssignment);
      const assignment = await service.remove(assignmentId, assignmentId);
      expect(assignment).toEqual(undefined);
    });
  });
});
