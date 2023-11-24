import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Length, Max, Min, IsBoolean } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'The assignment name' })
  @Length(1, 255)
  readonly name: string;

  @ApiProperty({ description: 'The assignment description' })
  @Length(1, 255)
  readonly description: string;

  @ApiProperty({ description: 'The assignment percentage' })
  @IsNumber()
  @Min(1)
  @Max(100)
  readonly percentage: number;
  
  @ApiProperty({ description: 'If the assignment is public(HW) or not (Quiz)' })
  @IsBoolean()
  public: boolean;

  @ApiProperty({ description: 'The module id' })
  @IsNumber()
  moduleId: number;
  
}
