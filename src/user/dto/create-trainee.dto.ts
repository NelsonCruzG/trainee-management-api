import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Min } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateTraineeDto extends CreateUserDto {
  @ApiProperty({ description: 'The trainee execution ID' })
  @IsPositive()
  @Min(1)
  readonly executionId: number;
}
