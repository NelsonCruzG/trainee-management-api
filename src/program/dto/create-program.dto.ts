import { ApiProperty } from '@nestjs/swagger';
import { Length, IsPositive } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({ description: 'The program name' })
  @Length(1, 255)
  readonly name: string;

  @ApiProperty({ description: 'The program image URL' })
  @Length(1, 255)
  readonly imageUrl: string;

  @ApiProperty({ description: 'The program description' })
  @Length(1, 255)
  readonly description: string;

  @ApiProperty({ description: "The program selected developers ID's" })
  @IsPositive({ each: true })
  readonly selected: number[];
}
