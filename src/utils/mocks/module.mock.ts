import { CreateModuleDto } from '../../module/dto/create-module.dto';
import { Program } from '../../program/entities/program.entity';
import { ModuleEntity } from '../../module/entities/module.entity';

export const mockModuleEntity: ModuleEntity = {
  moduleId: 1,
  name: 'module',
  description: 'desc',
  program: new Program(),
  topics: [],
  assignments: [],
};

export const mockModuleDto: CreateModuleDto = {
  name: 'module name',
  description: 'module desc',
  programId: 1,
};
