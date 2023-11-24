import { EvaluationAssignment } from '../../evaluation-assignment/entities/evaluation-assignment.entity';
import { SubmitEvaluationDto } from '../../evaluation-assignment/dto/submit-evaluation.dto';
import { CreateQuizEvaluationDto } from '../../evaluation-assignment/dto/create-quiz-evaluation.dto';

export const mockEvaluationAssignment: EvaluationAssignment = {
  evaluationAssignmentId: 1,
  url: 'URL',
  date: new Date(),
  assignment: null,
  evaluatedItems: [],
  users: [],
};

export const mockSubmitHomework: SubmitEvaluationDto = {
  url: 'URL',
  assignmentId: 1,
};

export const mockQuizEvaluation: CreateQuizEvaluationDto = {
  assignmentId: 1,
  traineeId: 1
}
