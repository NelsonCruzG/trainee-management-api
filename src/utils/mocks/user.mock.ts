import { Rol } from '../../rol/entities/rol.entity';
import { CreateEmployeeDto } from '../../user/dto/create-employee.dto';
import { CreateTraineeDto } from '../../user/dto/create-trainee.dto';
import { User } from '../../user/entities/users.entity';
import { PartialType } from '@nestjs/swagger';

export const mockUser: User = {
  userId: 1,
  firstName: 'name',
  lastName: 'last',
  phone: '12345678',
  email: 'myemail@email.com',
  status: true,
  description: 'desc',
  roles: [],
  evaluationAssignments: [],
  executions: [],
};

export const mockEmployee: CreateEmployeeDto = {
  firstName: 'name',
  lastName: 'last',
  phone: '12345678',
  email: 'myemail@email.com',
  roles: [],
};

export const mockUpdateEmployee = {
  firstName: 'name',
  lastName: 'last',
  phone: '12345678',
  email: 'myemail@email.com',
};

export const mockTrainee: CreateTraineeDto = {
  firstName: 'name',
  lastName: 'last',
  phone: '12345678',
  email: 'myemail@email.com',
  executionId: 1,
};

export const mockRol: Rol = {
  rolId: 1,
  rol: 'rol',
  users: [],
};
