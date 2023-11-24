import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ModuleService } from '../module/module.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    private moduleService: ModuleService,
  ) {}

  findAll(idUser: number): Promise<Topic[]> {
    return this.topicsRepository
      .createQueryBuilder('topic')
      .innerJoin('topic.module', 'module')
      .innerJoin('module.program', 'program')
      .innerJoin('program.executions', 'executions')
      .innerJoin('executions.users', 'users', 'users.userId = :idUser', {
        idUser,
      })
      .addSelect('module.moduleId')
      .getMany();
  }

  async findOne(id: number, idUser: number): Promise<Topic> {
    const topics = await this.findAll(idUser);
    const topic = topics.filter((a) => a.topicId === id)[0];
    if (!topic) {
      throw new NotFoundException(`Topic with ID #${id} not found`);
    }
    return topic;
  }

  async create(createTopicDto: CreateTopicDto, idUser: number): Promise<Topic> {
    const { moduleId: id, ...createDto } = createTopicDto;
    const module = await this.moduleService.findOne(id, idUser);
    if (!module) throw new NotFoundException(`Module with ID #${id} not found`);

    const topic = this.topicsRepository.create({ module, ...createDto });
    return this.topicsRepository.save(topic);
  }

  async update(
    id: number,
    updateTopicDto: UpdateTopicDto,
    idUser: number,
  ): Promise<Topic> {
    const { moduleId, ...updateDto } = updateTopicDto;
    this.findOne(id, idUser);

    const topic = await this.topicsRepository.preload({
      topicId: id,
      ...updateDto,
    });
    if (!topic) {
      throw new NotFoundException(`Topic with ID #${id} not found`);
    }
    return this.topicsRepository.save(topic);
  }

  async remove(id: number, idUser: number): Promise<void> {
    const topic = await this.findOne(id, idUser);
    await this.topicsRepository.remove(topic);
  }
}
