import { ExecutionService } from './execution.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Execution } from './entities/execution.entity';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { UpdateExecutionDto } from './dto/update-execution.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { User } from '../auth/decorator/user.decorator';
import { UserRole } from '../rol/entities/rols.enum';
import { Program } from '../program/entities/program.entity';
import { ModuleEntity } from '../module/entities/module.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Executions')
@Controller('executions')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Auth(UserRole.MANAGER)
  @Get()
  findExecutions(): Promise<Execution[]> {
    return this.executionService.findExecutions();
  }

  @Auth(UserRole.TRAINER)
  @Get(':id/trainees')
  findTraineesByExecution(
    @User('sub') idUser: number,
    @Param('id') idExecution: number,
  ): Promise<Execution> {
    return this.executionService.getTraineesByExecution(idUser, idExecution);
  }

  @Auth(UserRole.TRAINER)
  @Get('trainer')
  getExecutions(@User('sub') idUser: number): Promise<Execution[]> {
    return this.executionService.getExecutions(idUser);
  }

  @Auth(UserRole.TRAINER, UserRole.TRAINEE)
  @Get('programs/full')
  getFullExecutions(@User('sub') idUser: number): Promise<Execution[]> {
    return this.executionService.getFullExecutions(idUser);
  }

  @Auth(UserRole.TRAINER, UserRole.TRAINEE)
  @Get('programs')
  getProgramsByExecutions(@User('sub') idUser: number): Promise<Program[]> {
    return this.executionService.getProgramsByExecutions(idUser);
  }

  @Auth(UserRole.TRAINER, UserRole.TRAINEE)
  @Get('programs/:id/modules')
  getModulesByExecution(
    @User('sub') idUser: number,
    @Param('id') idProgram: number,
  ): Promise<ModuleEntity[]> {
    return this.executionService.getModulesByExecution(idUser, idProgram);
  }

  @Auth(UserRole.TRAINER, UserRole.TRAINEE)
  @Get('programs/:idP/modules/:idM/topics')
  getTopicsByExecution(
    @User('sub') idUser: number,
    @Param('idP') idProgram: number,
    @Param('idM') idModule: number,
  ): Promise<Topic[]> {
    return this.executionService.getTopicsByExecution(
      idUser,
      idProgram,
      idModule,
    );
  }

  @Auth(UserRole.TRAINEE)
  @Get('programs/:idP/modules/:idM/topics/resources')
  getResourcesByExecution(
    @User('sub') idUser: number,
    @Param('idP') idProgram: number,
    @Param('idM') idModule: number,
  ): Promise<Topic[]> {
    return this.executionService.getResourcesByExecution(
      idUser,
      idProgram,
      idModule,
    );
  }

  @Auth(UserRole.TRAINER)
  @Get('programs/:idP/modules/:idM/assignments')
  getAssignmentByExecution(
    @User('sub') idUser: number,
    @Param('idP') idProgram: number,
    @Param('idM') idModule: number,
  ): Promise<Assignment[]> {
    return this.executionService.getAssignmentByExecution(
      idUser,
      idProgram,
      idModule,
    );
  }

  @Auth(UserRole.TRAINEE)
  @Get('programs/:idP/modules/assignments')
  getAssignmentsByExecution(
    @User('sub') idUser: number,
    @Param('idP') idProgram: number,
  ): Promise<ModuleEntity[]> {
    return this.executionService.getAssignmentsByExecution(idUser, idProgram);
  }

  @Auth(UserRole.MANAGER)
  @Post()
  create(@Body() createExecutionDto: CreateExecutionDto): Promise<Execution> {
    return this.executionService.create(createExecutionDto);
  }

  @Auth(UserRole.MANAGER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateExecutionDto: UpdateExecutionDto,
  ): Promise<Execution> {
    return this.executionService.update(id, updateExecutionDto);
  }
}
