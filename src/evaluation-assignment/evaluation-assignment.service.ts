import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationAssignment } from './entities/evaluation-assignment.entity';
import { UpdateEvaluationAssignmentDto } from './dto/update-evaluation-assignment.dto';
import { SubmitEvaluationDto } from './dto/submit-evaluation.dto';
import { AssignmentService } from '../assignment/assignment.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/users.entity';
import { plainToClass } from 'class-transformer';
import { CreateQuizEvaluationDto } from './dto/create-quiz-evaluation.dto';

@Injectable()
export class EvaluationAssignmentService {
  constructor(
    @InjectRepository(EvaluationAssignment)
    private evaluationAssignmentsRepository: Repository<EvaluationAssignment>,
    private readonly assignmentService: AssignmentService,
    private readonly userService: UserService,
  ) {}

  findAll(): Promise<EvaluationAssignment[]> {
    return this.evaluationAssignmentsRepository.find({
      relations: ['users', 'assignment'],
    });
  }

  async findOne(id: number): Promise<EvaluationAssignment> {
    const evaluationAssignment =
      await this.evaluationAssignmentsRepository.findOne(id);
    if (!evaluationAssignment) {
      throw new NotFoundException(
        `Evaluation assignment with ID #${id} not found`,
      );
    }
    return evaluationAssignment;
  }

  async createQuizEvaluation(
    userId: number,
    createQuizEvaluationDto: CreateQuizEvaluationDto,
  ) {
    const { assignmentId, traineeId } = createQuizEvaluationDto;
    const assignment = await this.assignmentService.findOne(assignmentId, traineeId);
    await this.validateAssignment(traineeId, assignmentId);

    const trainer = await this.userService.findOne(userId);
    const trainee = await this.userService.findOne(traineeId);

    const plainTrainer = plainToClass(User, trainer);
    const plainTrainee = plainToClass(User, trainee);

    const users = [plainTrainer, plainTrainee];

    const evaluationAssignment = this.evaluationAssignmentsRepository.create({
      ...createQuizEvaluationDto,
      users,
      assignment,
    });

    return this.evaluationAssignmentsRepository.save(evaluationAssignment);
  }

  async submitHomework(
    userId: number,
    submitEvaluationDto: SubmitEvaluationDto,
  ): Promise<EvaluationAssignment> {
    const { assignmentId } = submitEvaluationDto;
    const assignment = await this.assignmentService.findOne(assignmentId, 1);
    await this.validateAssignment(userId, assignmentId);

    const user = await this.userService.findOne(userId);
    const plainUser = plainToClass(User, user);
    const users = [plainUser];
    const evaluationAssignment = this.evaluationAssignmentsRepository.create({
      ...submitEvaluationDto,
      users,
      assignment,
    });

    return this.evaluationAssignmentsRepository.save(evaluationAssignment);
  }

  async validateAssignment(
    userId: number,
    assignmentId: number,
  ): Promise<void> {
    const submit = await this.evaluationAssignmentsRepository
      .createQueryBuilder('evaluation')
      .leftJoinAndSelect('evaluation.users', 'users')
      .leftJoinAndSelect('evaluation.assignment', 'assignment')
      .where('users.userId = :userId', { userId })
      .andWhere('assignment.assignmentId = :assignmentId', { assignmentId })
      .getOne();

    if (submit) {
      throw new BadRequestException('Evaluation already submitted');
    }
  }

  async update(
    id: number,
    updateEvaluationAssignmentDto: UpdateEvaluationAssignmentDto,
  ): Promise<EvaluationAssignment> {
    const evaluationAssignment =
      await this.evaluationAssignmentsRepository.preload({
        evaluationAssignmentId: id,
        ...updateEvaluationAssignmentDto,
      });
    if (!evaluationAssignment) {
      throw new NotFoundException(
        `Evaluation assignment with ID #${id} not found`,
      );
    }
    return this.evaluationAssignmentsRepository.save(evaluationAssignment);
  }

  async remove(id: number): Promise<void> {
    const evaluationAssignment = await this.findOne(id);
    await this.evaluationAssignmentsRepository.remove(evaluationAssignment);
  }
}
