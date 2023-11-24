import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEvaluatedItemDto } from './dto/create-evaluated-item.dto';
import { UpdateEvaluatedItemDto } from './dto/update-evaluated-item.dto';
import { EvaluatedItem } from './entities/evaluated-item.entity';
import { EvaluationAssignmentService } from '../evaluation-assignment/evaluation-assignment.service';
import { ItemService } from '../item/item.service';
import { Item } from '../item/entities/item.entity';
import { EvaluationAssignment } from '../evaluation-assignment/entities/evaluation-assignment.entity';

@Injectable()
export class EvaluatedItemService {
  constructor(
    @InjectRepository(EvaluatedItem)
    private evaluatedItemsRepository: Repository<EvaluatedItem>,
    private evaluationAssignmentService: EvaluationAssignmentService,
    private itemService: ItemService,
  ) {}

  findAll(): Promise<EvaluatedItem[]> {
    return this.evaluatedItemsRepository.find({
      relations: ['item', 'evaluationAssignment'],
    });
  }

  async findOne(id: number): Promise<EvaluatedItem> {
    const evaluatedItem = await this.evaluatedItemsRepository.findOne(id);
    if (!evaluatedItem) {
      throw new NotFoundException(`Evaluated item with ID #${id} not found`);
    }
    return evaluatedItem;
  }

  async create(
    userId: number,
    createEvaluatedItemDto: CreateEvaluatedItemDto,
  ): Promise<EvaluatedItem> {
    const { itemId, evaluationAssignmentId } = createEvaluatedItemDto;
    const item = await this.itemService.findOne(itemId, userId);
    const evaluation = await this.evaluationAssignmentService.findOne(
      evaluationAssignmentId,
    );
    await this.validateItem(item, evaluation);

    const scored = this.evaluatedItemsRepository.create({
      ...createEvaluatedItemDto,
      item,
      evaluationAssignment: evaluation,
    });

    return this.evaluatedItemsRepository.save(scored);
  }

  async validateItem(
    item: Item,
    evaluationAssignment: EvaluationAssignment,
  ): Promise<void> {
    const { itemId } = item;
    const evaluated = await this.evaluatedItemsRepository.findOne({
      where: { item, evaluationAssignment },
    });
    if (evaluated) {
      throw new BadRequestException(
        `Item with ID [${itemId}] already evaluated`,
      );
    }
  }

  async update(
    id: number,
    updateEvaluatedItemDto: UpdateEvaluatedItemDto,
  ): Promise<EvaluatedItem> {
    const evaluatedItem = await this.evaluatedItemsRepository.preload({
      evaluatedItemId: id,
      ...updateEvaluatedItemDto,
    });
    if (!evaluatedItem) {
      throw new NotFoundException(`Evaluated item with ID #${id} not found`);
    }
    return this.evaluatedItemsRepository.save(evaluatedItem);
  }

  async remove(id: number): Promise<void> {
    const evaluatedItem = await this.findOne(id);
    await this.evaluatedItemsRepository.remove(evaluatedItem);
  }
}
