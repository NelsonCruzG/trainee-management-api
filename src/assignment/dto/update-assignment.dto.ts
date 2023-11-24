import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateAssignmentDto } from './create-assignment.dto';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
  @ApiProperty({ description: 'The module id can not be updated' })
  @IsEmpty()
  moduleId: number;
}
