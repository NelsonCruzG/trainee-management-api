import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateExecutionDto {
  @ApiProperty({ description: 'The execution name' })
  @Length(1, 255)
  readonly name: string;

  @ApiProperty({ description: 'The execution image url' })
  @Length(1, 255)
  readonly imageUrl: string;

  @ApiProperty({ description: 'The execution description' })
  @Length(1, 255)
  readonly description: string;

  @ApiProperty({ description: 'The execution begining' })
  @IsDateString()
  readonly begins: Date;

  @ApiProperty({ description: 'The execution ending' })
  @IsDateString()
  @IsOptional()
  readonly ends: Date;

  @ApiProperty({ description: 'The program name' })
  @IsString()
  readonly programName: string;

  @ApiProperty({ description: "The execution selected trainers ID's" })
  @IsPositive({ each: true })
  readonly selected: number[];
}
