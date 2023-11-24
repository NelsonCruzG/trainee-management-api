import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty({ description: 'The topic id can not be updated' })
  @IsEmpty()
  topicId: number;
}
