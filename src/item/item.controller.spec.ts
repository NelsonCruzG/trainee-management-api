import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockItem, mockItemDto } from '../utils/mocks/item.mock';
import { AssignmentService } from '../assignment/assignment.service';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { Item } from './entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  const { itemId, ...result } = mockItem;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: createMockRepository(),
        },
        {
          provide: AssignmentService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all items', async () => {
      const expected: Item[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      expect(await controller.findAll(itemId)).toBe(expected);
    });
  });

  describe('findOne', () => {
    it('Should return one item', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockItem);
      expect(await controller.findOne(itemId, itemId)).toBe(mockItem);
    });
  });

  describe('create', () => {
    it('Should create and return the item', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => mockItem);
      expect(await controller.create(mockItemDto, itemId)).toBe(mockItem);
    });
  });

  describe('update', () => {
    it('Should update and return the item', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => mockItem);
      expect(await controller.update(itemId, mockItemDto, itemId)).toBe(
        mockItem,
      );
    });
  });

  describe('delete', () => {
    it('Should remove one item', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);
      expect(await controller.delete(itemId, itemId)).toBe(undefined);
    });
  });
});
