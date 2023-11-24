import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Length } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ description: 'The resource label' })
  @Length(0, 255)
  readonly label: string;

  @ApiProperty({ description: 'The resource url' })
  @Length(0, 255)
  readonly url: string;

  @ApiProperty({ description: 'The resource url' })
  @IsNumber()
  topicId: number;
}
