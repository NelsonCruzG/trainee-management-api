import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EmployeeRoles } from '../../rol/entities/rols.enum';
import { CreateUserDto } from './create-user.dto';

export class CreateEmployeeDto extends CreateUserDto {
  @ApiProperty({ description: 'The employee roles list', enum: EmployeeRoles })
  @IsEnum(EmployeeRoles, {
    each: true,
    message: `Role must be: [${Object.values(EmployeeRoles).join(' / ')}]`,
  })
  readonly roles: EmployeeRoles[];
}
