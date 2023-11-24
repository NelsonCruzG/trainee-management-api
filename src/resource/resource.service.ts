import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private topicService: TopicService,
  ) {}

  findAll(idUser: number): Promise<Resource[]> {
    return this.resourceRepository
      .createQueryBuilder('resource')
      .innerJoin('resource.topic', 'topic')
      .innerJoin('topic.module', 'module')
      .innerJoin('module.program', 'program')
      .innerJoin('program.executions', 'executions')
      .innerJoin('executions.users', 'users', 'users.userId = :idUser', {
        idUser,
      })
      .addSelect('topic.topicId')
      .getMany();
  }

  async findOne(id: number, idUser: number): Promise<Resource> {
    const resources = await this.findAll(idUser);
    const resource = resources.filter((re) => re.resourceId === id)[0];
    if (!resource) {
      throw new NotFoundException(`Resource with ID #${id} not found`);
    }
    return resource;
  }

  async create(
    createResourceDto: CreateResourceDto,
    idUser: number,
  ): Promise<Resource> {
    const { topicId: id, ...createDto } = createResourceDto;
    const topic = await this.topicService.findOne(id, idUser);
    if (!topic) throw new NotFoundException(`Topic with ID #${id} not found`);

    const resource = this.resourceRepository.create({ topic, ...createDto });
    return this.resourceRepository.save(resource);
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
    idUser: number,
  ): Promise<Resource> {
    const { topicId, ...updateDto } = updateResourceDto;
    this.findOne(id, idUser);

    const resource = await this.resourceRepository.preload({
      resourceId: id,
      ...updateDto,
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID #${id} not found`);
    }
    return this.resourceRepository.save(resource);
  }

  async remove(id: number, idUser: number): Promise<void> {
    const resource = await this.findOne(id, idUser);
    await this.resourceRepository.remove(resource);
  }
}
