import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Length, Max, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'The item description' })
  @Length(1, 255)
  readonly description: string;

  @ApiProperty({ description: 'The item percentage number' })
  @IsPositive()
  @Min(1)
  @Max(100)
  readonly percentage: number;

  @ApiProperty({ description: 'The assignment id' })
  @IsPositive()
  assignmentId: number;
}
