import { EvaluatedItem } from '../../evaluated-item/entities/evaluated-item.entity';
import { CreateEvaluatedItemDto } from '../../evaluated-item/dto/create-evaluated-item.dto';

export const mockEvaluatedItem: EvaluatedItem = {
  evaluatedItemId: 1,
  comment: 'comment',
  percentage: 1,
  item: null,
  evaluationAssignment: null,
};

export const mockEvaluatedItemDto: CreateEvaluatedItemDto = {
  comment: 'comment',
  percentage: 1,
  itemId: 1,
  evaluationAssignmentId: 1,
};
