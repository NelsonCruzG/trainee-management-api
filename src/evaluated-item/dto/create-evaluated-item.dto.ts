import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Length, Max, Min } from 'class-validator';

export class CreateEvaluatedItemDto {
  @ApiProperty({ description: 'The evaluated item comment' })
  @Length(0, 255)
  readonly comment: string;

  @ApiProperty({ description: 'The evaluated item percentage scored' })
  @IsNumber()
  @Min(1)
  @Max(100)
  readonly percentage: number;
  
  @ApiProperty({ description: 'The evaluation ID' })
  @IsPositive()
  @Min(1)
  readonly evaluationAssignmentId: number;
  
  @ApiProperty({ description: 'The item (ID) being evaluated' })
  @IsPositive()
  @Min(1)
  readonly itemId: number;
}
