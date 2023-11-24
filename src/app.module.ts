import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfig } from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExecutionModule } from './execution/execution.module';
import { TopicModule } from './topic/topic.module';
import { AssignmentModule } from './assignment/assignment.module';
import { EvaluatedItemModule } from './evaluated-item/evaluated-item.module';
import { EvaluationAssignmentModule } from './evaluation-assignment/evaluation-assignment.module';
import { RolModule } from './rol/rol.module';
import { TokenModule } from './token/token.module';
import { ProgramModule } from './program/program.module';
import { ModuleModule } from './module/module.module';
import { ResourceModule } from './resource/resource.module';
import { ItemModule } from './item/item.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfig()),
    ScheduleModule.forRoot(),
    RolModule,
    ExecutionModule,
    TokenModule,
    ProgramModule,
    ModuleModule,
    TopicModule,
    ResourceModule,
    AssignmentModule,
    ItemModule,
    EvaluatedItemModule,
    EvaluationAssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
