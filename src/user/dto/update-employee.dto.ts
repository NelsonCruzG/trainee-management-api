import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EmployeeRoles } from '../../rol/entities/rols.enum';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @IsNotEmpty()
    readonly roles: EmployeeRoles[];
}
