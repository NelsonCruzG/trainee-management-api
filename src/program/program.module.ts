import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { UserModule } from '../user/user.module';
import { ExecutionModule } from '../execution/execution.module';

@Module({
  imports: [TypeOrmModule.forFeature([Program]), UserModule, ExecutionModule],
  providers: [ProgramService],
  controllers: [ProgramController],
  exports: [ProgramService],
})
export class ProgramModule {}
