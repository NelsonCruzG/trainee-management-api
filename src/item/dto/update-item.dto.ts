import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({ description: 'The assignment id can not be updated' })
  @IsEmpty()
  assignmentId: number;
}
