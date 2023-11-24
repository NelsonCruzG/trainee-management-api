import { Module } from '@nestjs/common';
import { EvaluatedItemService } from './evaluated-item.service';
import { EvaluatedItemController } from './evaluated-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluatedItem } from './entities/evaluated-item.entity';
import { EvaluationAssignmentModule } from '../evaluation-assignment/evaluation-assignment.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluatedItem]), EvaluationAssignmentModule, ItemModule],
  providers: [EvaluatedItemService],
  controllers: [EvaluatedItemController],
})
export class EvaluatedItemModule {}
