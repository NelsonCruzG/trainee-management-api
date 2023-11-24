import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEntity } from './entities/module.entity';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity]), ProgramModule],
  providers: [ModuleService],
  controllers: [ModuleController],
  exports: [ModuleService],
})
export class ModuleModule {}
