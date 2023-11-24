import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Execution } from './entities/execution.entity';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { UpdateExecutionDto } from './dto/update-execution.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramManager } from './entities/manager';
import { InheritanceService } from './inheritance/inheritance.service';
import { UserRole } from '../rol/entities/rols.enum';
import { Program } from '../program/entities/program.entity';
import { ModuleEntity } from '../module/entities/module.entity';
import { Topic } from '../topic/entities/topic.entity';
import { Assignment } from '../assignment/entities/assignment.entity';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectRepository(Execution)
    private executionsRepository: Repository<Execution>,
    private readonly inheritanceService: InheritanceService,
  ) {}

  findAll(): Promise<Execution[]> {
    return this.executionsRepository.find({
      order: { executionId: 'ASC' },
      relations: ['program'],
    });
  }

  findExecutions(): Promise<Execution[]> {
    return this.executionsRepository.find({
      relations: ['program', 'program.modules'],
      where: { management: false },
    });
  }

  async getTraineesByExecution(
    idUser: number,
    idExecution: number,
  ): Promise<Execution> {
    const role = UserRole.TRAINEE;

    const execution = await this.executionsRepository
      .createQueryBuilder('exec')
      .innerJoinAndSelect('exec.users', 'usersSelect')
      .innerJoin('usersSelect.roles', 'roles', 'roles.rol = :role', { role })
      .innerJoin('exec.users', 'users', 'users.userId = :idUser', { idUser })
      .where('exec.executionId = :idExecution', { idExecution })
      .getOne();

    if (!execution)
      throw new NotFoundException(
        `Execution with ID #${idExecution} not found`,
      );
    return execution;
  }

  getFullExecutions(id: number): Promise<Execution[]> {
    const role = UserRole.TRAINER;

    return this.executionsRepository
      .createQueryBuilder('exec')
      .leftJoinAndSelect('exec.users', 'usersSelect')
      .leftJoinAndSelect('usersSelect.roles', 'roles')
      .leftJoinAndSelect('exec.program', 'program')
      .leftJoinAndSelect('program.modules', 'modules')
      .leftJoinAndSelect('modules.topics', 'topics')
      .leftJoinAndSelect('topics.resources', 'resources')
      .leftJoinAndSelect('modules.assignments', 'assignments')
      .leftJoin('exec.users', 'users')
      .where('users.userId = :id', { id })
      .andWhere('roles.rol = :role', {
        role,
      })
      .getMany();
  }

  async getExecutions(idUser: number): Promise<Execution[]> {
    return this.executionsRepository
      .createQueryBuilder('exec')
      .innerJoin('exec.program', 'program')
      .innerJoin('exec.users', 'users', 'users.userId = :idUser', { idUser })
      .addSelect('program.programId')
      .getMany();
  }

  async getProgramsByExecutions(idUser: number): Promise<Program[]> {
    const executions = await this.getExecutions(idUser);
    return Promise.all(
      executions.map((exec) =>
        this.inheritanceService.getMyProgram(exec.program.programId),
      ),
    );
  }

  async getModulesByExecution(
    idUser: number,
    idProgram: number,
  ): Promise<ModuleEntity[]> {
    const programs = await this.getProgramsByExecutions(idUser);
    const program = programs.filter(
      (program) => program.programId === idProgram,
    )[0];

    return this.inheritanceService.getMyModules(program);
  }

  async getTopicsByExecution(
    idUser: number,
    idProgram: number,
    idModule: number,
  ): Promise<Topic[]> {
    const modules = await this.getModulesByExecution(idUser, idProgram);
    const module = modules.filter((module) => module.moduleId === idModule)[0];
    return this.inheritanceService.getMyTopics(module);
  }

  async getResourcesByExecution(
    idUser: number,
    idProgram: number,
    idModule: number,
  ): Promise<Topic[]> {
    const modules = await this.getModulesByExecution(idUser, idProgram);
    const module = modules.filter((module) => module.moduleId === idModule)[0];
    return this.inheritanceService.getTopics(module);
  }

  async getAssignmentByExecution(
    idUser: number,
    idProgram: number,
    idModule: number,
  ): Promise<Assignment[]> {
    const modules = await this.getModulesByExecution(idUser, idProgram);
    const module = modules.filter((module) => module.moduleId === idModule)[0];
    return this.inheritanceService.getMyAssignments(module);
  }

  async getAssignmentsByExecution(
    idUser: number,
    idProgram: number,
  ): Promise<ModuleEntity[]> {
    const modules = await this.getModulesByExecution(idUser, idProgram);

    return Promise.all(
      modules.map(async (module) => {
        module.assignments = await this.inheritanceService.getMyAssignments(
          module,
        );
        return module;
      }),
    );
  }

  async create(createExecutionDto: CreateExecutionDto): Promise<Execution> {
    const { programName, selected } = createExecutionDto;
    const trainers = await this.inheritanceService.getTrainers(selected);
    const execution = this.executionsRepository.create({
      ...createExecutionDto,
      users: trainers,
    });

    const program = await this.inheritanceService.getProgram(programName, null);
    if (!program) {
      throw new NotFoundException(
        `Program with name: [${programName}] not found`,
      );
    }

    await this.inheritanceService.inheritProgram(program, execution);
    return this.executionsRepository.save(execution);
  }

  async createManager(
    createManagerExecution: ProgramManager,
  ): Promise<Execution> {
    return this.executionsRepository.save(createManagerExecution);
  }

  async update(
    id: number,
    updateExecutionDto: UpdateExecutionDto,
  ): Promise<Execution> {
    const execution = await this.executionsRepository.preload({
      executionId: id,
      ...updateExecutionDto,
    });
    if (!execution) {
      throw new NotFoundException(`Execution with ID #${id} not found`);
    }
    return this.executionsRepository.save(execution);
  }
}
