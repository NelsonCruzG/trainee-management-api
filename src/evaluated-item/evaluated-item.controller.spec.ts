import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EvaluationAssignmentService } from '../evaluation-assignment/evaluation-assignment.service';
import { ItemService } from '../item/item.service';
import {
  mockEvaluatedItem,
  mockEvaluatedItemDto,
} from '../utils/mocks/evaluated-items.mock';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { EvaluatedItem } from './entities/evaluated-item.entity';
import { EvaluatedItemController } from './evaluated-item.controller';
import { EvaluatedItemService } from './evaluated-item.service';
import { mockUser } from '../utils/mocks/user.mock';

describe('EvaluatedItemController', () => {
  let controller: EvaluatedItemController;
  let service: EvaluatedItemService;
  const { evaluatedItemId, ...dto } = mockEvaluatedItem;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluatedItemController],
      providers: [
        EvaluatedItemService,
        {
          provide: getRepositoryToken(EvaluatedItem),
          useValue: createMockRepository(),
        },
        {
          provide: EvaluationAssignmentService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: ItemService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<EvaluatedItemController>(EvaluatedItemController);
    service = module.get<EvaluatedItemService>(EvaluatedItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all evaluated items', async () => {
      const expected: EvaluatedItem[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll()).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one evaluated item', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockEvaluatedItem);
      expect(await controller.findOne(evaluatedItemId)).toBe(mockEvaluatedItem);
    });
  });

  describe('create', () => {
    it('Should create and return the evaluated item', async () => {
      const { userId } = mockUser
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => mockEvaluatedItem);
      expect(await controller.create(userId, mockEvaluatedItemDto)).toBe(
        mockEvaluatedItem,
      );
    });
  });

  describe('update', () => {
    it('Should update and return the evaluated item', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockEvaluatedItem);
      expect(await controller.update(evaluatedItemId, mockEvaluatedItemDto)).toBe(
        mockEvaluatedItem,
      );
    });
  });

  describe('delete', () => {
    it('Should remove one evaluated item', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(evaluatedItemId)).toBe(undefined);
    });
  });
});
