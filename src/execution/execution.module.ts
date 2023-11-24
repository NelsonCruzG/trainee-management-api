import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { Execution } from './entities/execution.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../program/entities/program.entity';
import { UserModule } from '../user/user.module';
import { InheritanceService } from './inheritance/inheritance.service';
import { ModuleEntity } from '../module/entities/module.entity';
import { Resource } from '../resource/entities/resource.entity';
import { Topic } from '../topic/entities/topic.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Execution,
      Program,
      ModuleEntity,
      Resource,
      Topic,
      Assignment,
      Item,
    ]),
    UserModule,
  ],
  providers: [ExecutionService, InheritanceService],
  controllers: [ExecutionController],
  exports: [ExecutionService],
})
export class ExecutionModule {}
