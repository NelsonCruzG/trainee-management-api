import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { UserService } from '../user/user.service';
import { EmployeeRoles } from '../rol/entities/rols.enum';
import { ExecutionService } from '../execution/execution.service';
import { ProgramManager } from '../execution/entities/manager';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private programsRepository: Repository<Program>,
    private readonly userService: UserService,
    private readonly executionService: ExecutionService,
  ) {}

  findAll(): Promise<Program[]> {
    return this.programsRepository.find({
      relations: ['executions'],
    });
  }

  findPrograms(): Promise<Program[]> {
    return this.programsRepository.find({
      where: { parentProgram: IsNull() },
      relations: ['modules'],
    });
  }

  async findOne(id: number): Promise<Program> {
    const program = await this.programsRepository.findOne(id, {
      relations: ['parentProgram', 'childPrograms', 'executions', 'modules'],
    });
    if (!program) {
      throw new NotFoundException(`Program with ID #${id} not found`);
    }
    return program;
  }

  async findByName(name: string): Promise<Program[]> {
    return this.programsRepository.find({ name });
  }

  async createNewProgram(createProgramDto: CreateProgramDto): Promise<Program> {
    const { selected, name } = createProgramDto;
    const nameExist = await this.programsRepository.findOne({ name });
    if (nameExist) {
      throw new BadRequestException(`Program: [${name}] already exists`);
    }

    const roles = [EmployeeRoles.DEVELOPER];
    const employees = await this.userService.findUsersByRoles(roles);
    const users = employees.filter((employee) =>
      selected.includes(employee.userId),
    );
    const executionName = 'Management: ' + name;
    const toCreateExecution: ProgramManager = {
      name: executionName,
      management: true,
      users,
    };
    const execution = await this.executionService.createManager(
      toCreateExecution,
    );
    const program = this.programsRepository.create({
      ...createProgramDto,
      executions: [execution],
    });

    return this.programsRepository.save(program);
  }

  async update(
    id: number,
    updateProgramDto: UpdateProgramDto,
  ): Promise<Program> {
    const program = await this.programsRepository.preload({
      programId: id,
      ...updateProgramDto,
    });
    if (!program) {
      throw new NotFoundException(`Program with ID #${id} not found`);
    }
    return this.programsRepository.save(program);
  }

  async remove(id: number): Promise<void> {
    const program = await this.findOne(id);
    await this.programsRepository.remove(program);
  }

  findOneParentById(id: number): Promise<Program> {
    return this.programsRepository.findOne(id, {
      where: { parentProgram: IsNull() },
    });
  }

  async findOneByUser(id: number, idUser: number): Promise<Program> {
    return this.programsRepository
      .createQueryBuilder('program')
      .innerJoin('program.executions', 'executions')
      .innerJoin('executions.users', 'users', 'users.userId = :idUser', {
        idUser,
      })
      .addSelect('executions.executionId')
      .where('program.programId = :id', { id })
      .getOne();
  }
}
