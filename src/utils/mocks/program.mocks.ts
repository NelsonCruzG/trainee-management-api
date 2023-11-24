import { CreateProgramDto } from '../../program/dto/create-program.dto';
import { Program } from '../../program/entities/program.entity';

export const mockProgram: Program = {
  programId: 1,
  name: 'name',
  imageUrl: 'www.image.url',
  description: 'desc',
  parentProgram: null,
  childPrograms: [],
  executions: [],
  modules: [],
};

export const mockProgramDto: CreateProgramDto = {
  name: 'name',
  imageUrl: 'www.image.url',
  description: 'desc',
  selected: [],
};
