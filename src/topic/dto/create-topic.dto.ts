import { ApiProperty } from '@nestjs/swagger';
import { Length, IsPositive } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ description: 'The topic name' })
  @Length(1, 255)
  readonly name: string;

  @ApiProperty({ description: 'The module id' })
  @IsPositive()
  moduleId: number;
}
