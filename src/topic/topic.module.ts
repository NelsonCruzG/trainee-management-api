import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { ModuleModule } from '../module/module.module';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]), ModuleModule],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
