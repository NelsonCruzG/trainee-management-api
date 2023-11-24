import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AssignmentService } from '../assignment/assignment.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    private assignmentService: AssignmentService,
  ) {}

  findAll(idUser: number): Promise<Item[]> {
    return this.itemsRepository
      .createQueryBuilder('item')
      .innerJoin('item.assignment', 'assignment')
      .innerJoin('assignment.module', 'module')
      .innerJoin('module.program', 'program')
      .innerJoin('program.executions', 'executions')
      .innerJoin('executions.users', 'users', 'users.userId = :idUser', {
        idUser,
      })
      .addSelect('assignment.assignmentId')
      .getMany();
  }

  async findOne(id: number, idUser: number): Promise<Item> {
    const items = await this.findAll(idUser);
    const item = items.filter((it) => it.itemId === id)[0];
    if (!item) {
      throw new NotFoundException(`Item with ID #${id} not found`);
    }
    return item;
  }

  async create(createItemDto: CreateItemDto, idUser: number): Promise<Item> {
    const { assignmentId: id, ...createDto } = createItemDto;
    const assignment = await this.assignmentService.findOne(id, idUser);
    if (!assignment)
      throw new NotFoundException(`Assignment with ID #${id} not found`);

    const item = this.itemsRepository.create({ assignment, ...createDto });
    return this.itemsRepository.save(item);
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    idUser: number,
  ): Promise<Item> {
    const { assignmentId, ...updateDto } = updateItemDto;
    this.findOne(id, idUser);

    const item = await this.itemsRepository.preload({
      itemId: id,
      ...updateDto,
    });
    if (!item) {
      throw new NotFoundException(`Item with ID #${id} not found`);
    }
    return this.itemsRepository.save(item);
  }

  async remove(id: number, idUser: number): Promise<void> {
    const item = await this.findOne(id, idUser);
    await this.itemsRepository.remove(item);
  }
}
