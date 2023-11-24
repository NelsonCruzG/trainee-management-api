import { Module } from '@nestjs/common';
import { EvaluationAssignmentService } from './evaluation-assignment.service';
import { EvaluationAssignmentController } from './evaluation-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationAssignment } from './entities/evaluation-assignment.entity';
import { AssignmentModule } from '../assignment/assignment.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationAssignment]),
    AssignmentModule,
    UserModule,
  ],
  providers: [EvaluationAssignmentService],
  controllers: [EvaluationAssignmentController],
  exports: [EvaluationAssignmentService]
})
export class EvaluationAssignmentModule {}
