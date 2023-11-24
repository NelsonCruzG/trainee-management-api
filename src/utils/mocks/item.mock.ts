import { CreateItemDto } from '../../item/dto/create-item.dto';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Item } from '../../item/entities/item.entity';

export const mockItem: Item = {
  itemId: 1,
  description: 'desc',
  percentage: 1,
  assignment: new Assignment(),
  evaluatedItems: [],
};

export const mockItemDto: CreateItemDto = {
  description: 'desc',
  percentage: 1,
  assignmentId: 1,
};
