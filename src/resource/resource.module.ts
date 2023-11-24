import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), TopicModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
