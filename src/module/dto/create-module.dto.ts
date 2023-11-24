import { ApiProperty } from '@nestjs/swagger';
import { Length, IsPositive } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ description: 'The module name' })
  @Length(1, 255)
  readonly name: string;

  @ApiProperty({ description: 'The module description' })
  @Length(1, 255)
  readonly description: string;

  @ApiProperty({ description: 'The program id' })
  @IsPositive()
  programId: number;
}
