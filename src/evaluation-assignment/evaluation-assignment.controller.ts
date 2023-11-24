import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EvaluationAssignment } from './entities/evaluation-assignment.entity';
import { EvaluationAssignmentService } from './evaluation-assignment.service';
import { UpdateEvaluationAssignmentDto } from './dto/update-evaluation-assignment.dto';
import { SubmitEvaluationDto } from './dto/submit-evaluation.dto';
import { UserRole } from '../rol/entities/rols.enum';
import { Auth } from '../auth/decorator/auth.decorator';
import { User } from '../auth/decorator/user.decorator';
import { CreateQuizEvaluationDto } from './dto/create-quiz-evaluation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Asignments Evaluations')
@Controller('evaluation-assignments')
export class EvaluationAssignmentController {
  constructor(
    private readonly evaluationAssignmentService: EvaluationAssignmentService,
  ) {}

  @Auth(UserRole.TRAINER)
  @Get()
  findAll(): Promise<EvaluationAssignment[]> {
    return this.evaluationAssignmentService.findAll();
  }

  @Auth(UserRole.TRAINER)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<EvaluationAssignment> {
    return this.evaluationAssignmentService.findOne(id);
  }

  @Auth(UserRole.TRAINEE)
  @Post('submit')
  submitHomework(
    @User('sub') id: number,
    @Body() submitEvaluationDto: SubmitEvaluationDto,
  ): Promise<EvaluationAssignment> {
    return this.evaluationAssignmentService.submitHomework(
      id,
      submitEvaluationDto,
    );
  }

  @Auth(UserRole.TRAINER)
  @Post('quiz')
  createQuizEvaluation(
    @User('sub') id: number,
    @Body() createQuizEvaluationDto: CreateQuizEvaluationDto,
  ): Promise<EvaluationAssignment> {
    return this.evaluationAssignmentService.createQuizEvaluation(
      id,
      createQuizEvaluationDto,
    );
  }

  @Auth(UserRole.TRAINER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateEvaluationAssignmentDto: UpdateEvaluationAssignmentDto,
  ): Promise<EvaluationAssignment> {
    return this.evaluationAssignmentService.update(
      id,
      updateEvaluationAssignmentDto,
    );
  }

  @Auth(UserRole.TRAINER)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.evaluationAssignmentService.remove(id);
  }
}
