import { CreateAssignmentDto } from '../../assignment/dto/create-assignment.dto';
import { Assignment } from '../../assignment/entities/assignment.entity';

export const mockAssignment: Assignment = {
  assignmentId: 1,
  name: 'name',
  description: 'desc',
  percentage: 1,
  public: true,
  module: null,
  items: [],
  evaluationAssignments: [],
};

export const mockAssignmentDto: CreateAssignmentDto = {
  name: 'name',
  description: 'desc',
  percentage: 1,
  moduleId: 1,
  public: true,
};
