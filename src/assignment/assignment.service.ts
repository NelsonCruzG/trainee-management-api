import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ModuleService } from '../module/module.service';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    private moduleService: ModuleService,
  ) {}

  async findAll(idUser: number): Promise<Assignment[]> {
    return this.assignmentsRepository
      .createQueryBuilder('assignment')
      .innerJoin('assignment.module', 'module')
      .innerJoin('module.program', 'program')
      .innerJoin('program.executions', 'executions')
      .innerJoin('executions.users', 'users', 'users.userId = :idUser', {
        idUser,
      })
      .addSelect('module.moduleId')
      .getMany();
  }

  async findOne(id: number, idUser: number): Promise<Assignment> {
    const assignments = await this.findAll(idUser);
    const assignment = assignments.filter((a) => a.assignmentId === id)[0];
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID #${id} not found`);
    }
    return assignment;
  }

  async create(
    createAssignmentDto: CreateAssignmentDto,
    idUser: number,
  ): Promise<Assignment> {
    const { moduleId: id, ...createDto } = createAssignmentDto;
    const module = await this.moduleService.findOne(id, idUser);
    if (!module) throw new NotFoundException(`Module with ID #${id} not found`);

    const assignment = this.assignmentsRepository.create({
      module,
      ...createDto,
    });
    return this.assignmentsRepository.save(assignment);
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
    idUser: number,
  ): Promise<Assignment> {
    const { moduleId, ...updateDto } = updateAssignmentDto;
    this.findOne(id, idUser);

    const assignment = await this.assignmentsRepository.preload({
      assignmentId: id,
      ...updateDto,
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID #${id} not found`);
    }
    return this.assignmentsRepository.save(assignment);
  }

  async remove(id: number, idUser: number): Promise<void> {
    const assignment = await this.findOne(id, idUser);
    await this.assignmentsRepository.remove(assignment);
  }
}
