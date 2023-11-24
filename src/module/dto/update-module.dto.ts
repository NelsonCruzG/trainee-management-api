import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateModuleDto } from './create-module.dto';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @ApiProperty({ description: 'The program id can not be updated' })
  @IsEmpty()
  programId: number;
}
