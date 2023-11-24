import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString, Min } from 'class-validator';
import { CreateEvaluationAssignmentDto } from './create-evaluation-assignment.dto';

export class SubmitEvaluationDto extends CreateEvaluationAssignmentDto {
  @ApiProperty({ description: 'The repository url for the assigment' })
  @IsString()
  readonly url: string;

  @ApiProperty({ description: 'The assignment ID' })
  @IsPositive()
  @Min(1)
  readonly assignmentId: number;
}
