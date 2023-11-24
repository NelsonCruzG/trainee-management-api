import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The user status [active = true/ inactive = false]',
  })
  @IsBoolean()
  @IsOptional()
  readonly status: boolean;

  @ApiProperty({ description: 'The user self description' })
  @IsString()
  @IsOptional()
  readonly description: string;
}
