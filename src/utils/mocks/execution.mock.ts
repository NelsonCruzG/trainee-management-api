import { Execution } from '../../execution/entities/execution.entity';
import { CreateExecutionDto } from '../../execution/dto/create-execution.dto';
import { User } from '../../user/entities/users.entity';
import { mockUser } from './user.mock';
import { ProgramManager } from '../../execution/entities/manager';
import { mockProgram } from './program.mocks';

export const mockExecution: Execution = {
  executionId: 1,
  name: 'name',
  imageUrl: 'image',
  description: 'desc',
  begins: new Date(),
  ends: new Date(),
  management: false,
  users: [mockUser],
  program: mockProgram,
};

export const mockExecutionDto: CreateExecutionDto = {
  name: 'name',
  imageUrl: 'image',
  description: 'desc',
  begins: new Date(),
  ends: new Date(),
  programName: 'name',
  selected: [],
};

export const mockManagerDto: ProgramManager = {
  name: 'name',
  management: false,
  users: [new User()],
};
