import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Min } from 'class-validator';

export class CreateEvaluationAssignmentDto {
  @ApiProperty({ description: 'The assignment ID' })
    @IsPositive()
    @Min(1)
    readonly assignmentId: number;
}
