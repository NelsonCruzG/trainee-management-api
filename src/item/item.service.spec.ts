import { Test, TestingModule } from '@nestjs/testing';
import {
  createMockRepository,
  createMockSelectQueryBuilder,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AssignmentService } from '../assignment/assignment.service';
import { mockItem, mockItemDto } from '../utils/mocks/item.mock';
import { mockAssignment } from '../utils/mocks/assignment.mock';

describe('ItemService', () => {
  let service: ItemService;
  let assignmentService: AssignmentService;
  let repository: MockRepository;

  const { itemId, ...result } = mockItem;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ItemService>(ItemService);
    assignmentService = module.get<AssignmentService>(AssignmentService);
    repository = module.get<MockRepository>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all Items', async () => {
      const expectedItems: Item[] = [];
      const selectBuilder = createMockSelectQueryBuilder();
      repository.createQueryBuilder.mockReturnValue(selectBuilder);
      selectBuilder.innerJoin.mockReturnThis();
      selectBuilder.addSelect.mockReturnThis();
      selectBuilder.getMany.mockReturnValue(expectedItems);
      const items = await service.findAll(itemId);
      expect(items).toEqual(expectedItems);
    });
  });

  describe('findOne', () => {
    describe('When item exists', () => {
      it('Should return the item', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockItem]);
        const item = await service.findOne(itemId, itemId);
        expect(item).toEqual(mockItem);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);

        try {
          await service.findOne(itemId, itemId);
        } catch (err) {
          expect(err).toBeInstanceOf(TypeError);
        }
      });
    });
  });

  describe('create', () => {
    describe('If Assignment is not null', () => {
      it('Should create and return the new Item', async () => {
        jest
          .spyOn(assignmentService, 'findOne')
          .mockResolvedValue(mockAssignment);

        repository.create.mockReturnValue(mockItem);
        repository.save.mockReturnValue(mockItem);
        const item = await service.create(mockItemDto, itemId);
        expect(item).toEqual(mockItem);
      });
    });

    describe('If Assignment is null', () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(assignmentService, 'findOne').mockResolvedValue(undefined);

        try {
          await service.create(mockItemDto, itemId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Assignment with ID #${itemId} not found`,
          );
        }
      });
    });
  });

  describe('update', () => {
    describe("If item doesn't exists", () => {
      it('Should throw a Not found Exception', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(undefined);
        jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
        repository.preload.mockReturnValue(undefined);
        try {
          await service.update(itemId, mockItemDto, itemId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Item with ID #${itemId} not found`);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should update and return the item', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([mockItem]);
        jest.spyOn(service, 'findOne').mockResolvedValue(mockItem);
        repository.preload.mockReturnValue(mockItem);
        repository.save.mockReturnValue(mockItem);
        const item = await service.update(itemId, mockItemDto, itemId);
        expect(item).toEqual(mockItem);
      });
    });
  });

  describe('remove', () => {
    it('Should remove the item', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockItem]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItem);
      const item = await service.remove(itemId, itemId);
      expect(item).toEqual(undefined);
    });
  });
});
