import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateTopicDto } from './create-topic.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  @ApiProperty({ description: 'The module id can not be updated' })
  @IsEmpty()
  moduleId: number;
}
