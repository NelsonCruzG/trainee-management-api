import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { RolService } from '../rol/rol.service';
import { UserRole, EmployeeRoles } from '../rol/entities/rols.enum';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { Execution } from '../execution/entities/execution.entity';

@Injectable()
export class UserService implements OnModuleInit{
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Execution)
    private executionsRepository: Repository<Execution>,
    private readonly rolService: RolService,
  ) {}

  async onModuleInit() {
    const emailManager = 'nelsoncruz.1250@gmail.com';
    const admin: CreateEmployeeDto = {
      firstName: 'DefaulAdmin',
      lastName: 'DefaulLastName',
      phone: '123 12345678',
      email: emailManager,
      roles: [EmployeeRoles.MANAGER],
    };
    const isAdimCreated = await this.usersRepository.find({ email: emailManager });
    if (isAdimCreated) {
      return;
    }
    await this.createEmployee(admin);
  }

  async findUsersByRoles(roles: UserRole[] | EmployeeRoles[]): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'rolesSelect')
      .leftJoin('user.roles', 'roles')
      .where('roles.rol IN (:...roles)', { roles })
      .getMany();
  }

  async findAllEmployees(): Promise<User[]> {
    const roles = Object.values(EmployeeRoles);
    return this.findUsersByRoles(roles);
  }

  async findAllTrainees(): Promise<User[]> {
    const roles = [UserRole.TRAINEE];
    return this.findUsersByRoles(roles);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id, {
      relations: [
        'roles',
        'evaluationAssignments',
        'executions',
        'executions.program',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async createEmployee(createUserDto: CreateEmployeeDto): Promise<User> {
    const { email } = createUserDto;
    await this.validateEmail(email);

    const { roles: searchRoles } = createUserDto;
    const roles = await this.rolService.findRoles(searchRoles);
    const employee = this.usersRepository.create({
      ...createUserDto,
      roles,
    });
    return this.usersRepository.save(employee);
  }

  async createTrainee(createTraineeDto: CreateTraineeDto): Promise<User> {
    const { email, executionId } = createTraineeDto;
    await this.validateEmail(email);

    const traineeRol = await this.rolService.preloadRolesByName(
      UserRole.TRAINEE,
    );

    const execution = await this.executionsRepository.findOne(executionId, {
      where: { management: false },
    });
    if (!execution) {
      throw new NotFoundException(
        `Execution with ID #${executionId} not found`,
      );
    }
    const trainee = this.usersRepository.create({
      ...createTraineeDto,
      roles: [traineeRol],
      executions: [execution],
    });
    return this.usersRepository.save(trainee);
  }

  async validateEmail(email: string): Promise<void> {
    const mailExist = await this.usersRepository.findOne({ email });
    if (mailExist) {
      throw new BadRequestException(
        `User with email: [${email}] already exists`,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({
      userId: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return this.usersRepository.save(user);
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    const { roles: searchRoles } = updateEmployeeDto;
    if(!searchRoles) {
      throw new BadRequestException('roles must not be empty')
    }
    const roles = await this.rolService.findRoles(searchRoles);    
    const employee = await this.usersRepository.preload({
      userId: id,
      ...updateEmployeeDto,
      roles,
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID #${id} not found`);
    }

    return this.usersRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
  /**
   * @param email to search one user by email
   * @returns a promise<Undefided> or promise<User>
   */
  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email }, { relations: ['roles'] });
  }
}
