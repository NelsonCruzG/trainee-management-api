import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateEvaluatedItemDto } from './create-evaluated-item.dto';

export class UpdateEvaluatedItemDto extends PartialType(
  CreateEvaluatedItemDto,
) {
  @ApiProperty({ description: 'The evaluation assignmentId id can not be updated' })
  @IsEmpty()
  readonly evaluationAssignmentId: number;
  
  @ApiProperty({ description: 'The item id can not be updated' })
  @IsEmpty()
  readonly itemId: number;
}
