import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ModuleEntity } from '../../module/entities/module.entity';
import { Program } from '../../program/entities/program.entity';
import { Resource } from '../../resource/entities/resource.entity';
import { EmployeeRoles } from '../../rol/entities/rols.enum';
import { Topic } from '../../topic/entities/topic.entity';
import { User } from '../../user/entities/users.entity';
import { UserService } from '../../user/user.service';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Item } from '../../item/entities/item.entity';
import { Execution } from '../entities/execution.entity';

@Injectable()
export class InheritanceService {
  constructor(
    @InjectRepository(Program)
    private programsRepository: Repository<Program>,
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    private readonly userService: UserService,
  ) {}

  async getTrainers(list: number[]): Promise<User[]> {
    const rol = [EmployeeRoles.TRAINER];
    const employees = await this.userService.findUsersByRoles(rol);
    return employees.filter((employee) => list.includes(employee.userId));
  }

  async getProgram(name: string, parent: Program): Promise<Program> {
    const program = await this.programsRepository.findOne({
      where: [{ name, parentProgram: parent }],
      order: { programId: 'DESC' },
      relations: ['executions'],
    });
    if (program) {
      program.modules = await this.getModules(program);
    }
    return program;
  }

  async inheritProgram(program: Program, execution: Execution): Promise<void> {
    const { name } = program;
    const lastCopy = await this.getProgram(name, program);
    const newProgramCopy = plainToClass(Program, program);
    const lastProgramCopy = plainToClass(Program, lastCopy);
    const isEqual = this.comparePrograms(newProgramCopy, lastProgramCopy);

    if (isEqual) {
      lastCopy.executions.push(execution);
      await this.programsRepository.save(lastCopy);
    } else {
      newProgramCopy.parentProgram = program;
      newProgramCopy.executions = [execution];
      await this.programsRepository.save(newProgramCopy);
    }
  }

  comparePrograms(original: Program, copy: Program): boolean {
    const jsonOriginal = JSON.stringify(original);
    const jsonCopy = JSON.stringify(copy);

    return jsonOriginal === jsonCopy;
  }

  async getModules(program: Program): Promise<ModuleEntity[]> {
    const modules = await this.modulesRepository.find({
      where: { program },
      order: { moduleId: 'ASC' },
    });
    return Promise.all(
      modules.map(async (module) => {
        module.topics = await this.getTopics(module);
        module.assignments = await this.getAssignments(module);
        return module;
      }),
    );
  }

  async getTopics(module: ModuleEntity): Promise<Topic[]> {
    const topics = await this.topicsRepository.find({
      where: { module },
      order: { topicId: 'ASC' },
    });
    return Promise.all(
      topics.map(async (topic) => {
        topic.resources = await this.getResources(topic);
        return topic;
      }),
    );
  }

  async getResources(topic: Topic): Promise<Resource[]> {
    return this.resourcesRepository.find({
      where: { topic },
      order: { resourceId: 'ASC' },
    });
  }

  async getAssignments(module: ModuleEntity): Promise<Assignment[]> {
    const assignments = await this.assignmentsRepository.find({
      where: { module },
      order: { assignmentId: 'ASC' },
    });
    return Promise.all(
      assignments.map(async (assignment) => {
        assignment.items = await this.getItems(assignment);
        return assignment;
      }),
    );
  }

  async getItems(assignment: Assignment): Promise<Item[]> {
    return this.itemsRepository.find({
      where: { assignment },
      order: { itemId: 'ASC' },
    });
  }

  async getMyProgram(programId: number): Promise<Program> {
    return this.programsRepository.findOne(programId);
  }

  async getMyModules(program: Program): Promise<ModuleEntity[]> {
    return this.modulesRepository.find({ program });
  }

  async getMyTopics(module: ModuleEntity): Promise<Topic[]> {
    return this.topicsRepository.find({ module });
  }

  async getMyAssignments(module: ModuleEntity): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      where: { module },
      select: ['assignmentId', 'name', 'percentage'],
    });
  }
}
