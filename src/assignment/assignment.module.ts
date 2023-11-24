import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { ModuleModule } from '../module/module.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), ModuleModule],
  providers: [AssignmentService],
  controllers: [AssignmentController],
  exports: [AssignmentService],
})
export class AssignmentModule {}
