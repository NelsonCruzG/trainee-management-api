import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateEvaluationAssignmentDto } from './create-evaluation-assignment.dto';

export class UpdateEvaluationAssignmentDto extends PartialType(
  CreateEvaluationAssignmentDto,
) {
  @ApiProperty({ description: 'The repository url for the assigment' })
  @IsString()
  readonly url: string;
}
