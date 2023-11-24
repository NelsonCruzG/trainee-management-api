import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleEntity } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ProgramService } from '../program/program.service';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
    private programService: ProgramService,
  ) {}

  findAll(idUser: number): Promise<ModuleEntity[]> {
    return this.modulesRepository
      .createQueryBuilder('module')
      .innerJoin('module.program', 'program')
      .innerJoin('program.executions', 'executions')
      .innerJoin('executions.users', 'users', 'users.userId = :idUser', {
        idUser,
      })
      .addSelect('program.programId')
      .getMany();
  }

  async findOne(id: number, idUser: number): Promise<ModuleEntity> {
    const modules = await this.findAll(idUser);
    const module = modules.filter((m) => m.moduleId === id)[0];
    if (!module) {
      throw new NotFoundException(`Module with ID #${id} not found`);
    }
    return module;
  }

  async create(
    createModuleDto: CreateModuleDto,
    idUser: number,
  ): Promise<ModuleEntity> {
    const { programId: id, ...createDto } = createModuleDto;
    const program = await this.programService.findOneByUser(id, idUser);
    if (!program)
      throw new NotFoundException(`Program with ID #${id} not found`);

    const module = this.modulesRepository.create({ program, ...createDto });
    return this.modulesRepository.save(module);
  }

  async update(
    id: number,
    updateModuleDto: UpdateModuleDto,
    idUser: number,
  ): Promise<ModuleEntity> {
    const { programId, ...updateDto } = updateModuleDto;
    this.findOne(id, idUser);

    const module = await this.modulesRepository.preload({
      moduleId: id,
      ...updateDto,
    });
    if (!module) {
      throw new NotFoundException(`Module with ID #${id} not found`);
    }
    return this.modulesRepository.save(module);
  }

  async remove(id: number, idUser: number): Promise<void> {
    const module = await this.findOne(id, idUser);
    await this.modulesRepository.remove(module);
  }
}
