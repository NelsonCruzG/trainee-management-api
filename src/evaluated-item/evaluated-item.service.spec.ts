import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createMockRepository,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { EvaluatedItemService } from './evaluated-item.service';
import { EvaluatedItem } from './entities/evaluated-item.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  mockEvaluatedItem,
  mockEvaluatedItemDto,
} from '../utils/mocks/evaluated-items.mock';
import { EvaluationAssignmentService } from '../evaluation-assignment/evaluation-assignment.service';
import { ItemService } from '../item/item.service';
import { mockItem } from '../utils/mocks/item.mock';
import { mockEvaluationAssignment } from '../utils/mocks/evaluation-assignment.mock';
import { mockUser } from '../utils/mocks/user.mock';

describe('EvaluatedItemService', () => {
  let service: EvaluatedItemService;
  let itemService: ItemService;
  let repository: MockRepository;

  const { evaluatedItemId} = mockEvaluatedItem;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<EvaluatedItemService>(EvaluatedItemService);
    itemService = module.get<ItemService>(ItemService);
    repository = module.get<MockRepository>(getRepositoryToken(EvaluatedItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all evaluated items', async () => {
      const expectedItems: EvaluatedItem[] = [];

      repository.find.mockReturnValue(expectedItems);
      const evaluatedItems = await service.findAll();
      expect(evaluatedItems).toEqual(expectedItems);
    });
  });

  describe('findOne', () => {
    describe('When evalauted item exists', () => {
      it('Should return the evaluated item', async () => {
        repository.findOne.mockReturnValue(mockEvaluatedItem);
        const evaluatedItem = await service.findOne(evaluatedItemId);
        expect(evaluatedItem).toEqual(mockEvaluatedItem);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        repository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(evaluatedItemId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Evaluated item with ID #${evaluatedItemId} not found`,
          );
        }
      });
    });
  });

  describe('create', () => {
    it('Should create and return the new evaluated item', async () => {
      const { userId } = mockUser;
      jest
        .spyOn(itemService, 'findOne')
        .mockImplementation(async () => mockItem);
        
      repository.save.mockReturnValue(mockEvaluatedItem);
      const evaluatedItem = await service.create(userId, mockEvaluatedItemDto);
      expect(evaluatedItem).toEqual(mockEvaluatedItem);
    });
  });

  describe('validateItem', () => {
    describe('When an item is already evaluated', () => {
      it('Should throw a bad request exception', async () => {
        const { itemId } = mockItem;
        repository.findOne.mockReturnValue(mockEvaluatedItem);
        try {
          await service.validateItem(mockItem, mockEvaluationAssignment);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(
            `Item with ID [${itemId}] already evaluated`,
          );
        }
      });
    });

    describe('Otherwise', () => {
      it('It should not throw any error', async () => {
        repository.findOne.mockReturnValue(undefined);
        const result = await service.validateItem(
          mockItem,
          mockEvaluationAssignment,
        );
        expect(result).toBe(undefined);
      });
    });
  });

   describe('update', () => {
    describe("If evaluated item doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(evaluatedItemId, mockEvaluatedItemDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Evaluated item with ID #${evaluatedItemId} not found`,
          );
        }
      });
    });

     describe('Otherwise', () => {
      it('Should update and return the evaluated item', async () => {
        repository.preload.mockReturnValue(mockEvaluatedItem);
        repository.save.mockReturnValue(mockEvaluatedItem);
        const evaluatedItem = await service.update(evaluatedItemId, mockEvaluatedItemDto);
        expect(evaluatedItem).toEqual(mockEvaluatedItem);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the evaluated item', async () => {
      repository.findOne.mockReturnValue(mockEvaluatedItem);
      const evaluatedItem = await service.remove(evaluatedItemId);
      expect(evaluatedItem).toEqual(undefined);
    });
  });
});
