import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EvaluatedItem } from './entities/evaluated-item.entity';
import { EvaluatedItemService } from './evaluated-item.service';
import { CreateEvaluatedItemDto } from './dto/create-evaluated-item.dto';
import { UpdateEvaluatedItemDto } from './dto/update-evaluated-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';
import { User } from '../auth/decorator/user.decorator';

@ApiTags('Evaluated Items')
@Controller('evaluated-items')
export class EvaluatedItemController {
  constructor(private readonly evaluatedItemService: EvaluatedItemService) {}

  @Auth(UserRole.TRAINER)
  @Get()
  findAll(): Promise<EvaluatedItem[]> {
    return this.evaluatedItemService.findAll();
  }

  @Auth(UserRole.TRAINER)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<EvaluatedItem> {
    return this.evaluatedItemService.findOne(id);
  }

  @Auth(UserRole.TRAINER)
  @Post()
  create(
    @User('sub') id: number,
    @Body() createEvaluatedItemDto: CreateEvaluatedItemDto,
  ): Promise<EvaluatedItem> {
    return this.evaluatedItemService.create(id, createEvaluatedItemDto);
  }

  @Auth(UserRole.TRAINER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateEvaluatedItemDto: UpdateEvaluatedItemDto,
  ): Promise<EvaluatedItem> {
    return this.evaluatedItemService.update(id, updateEvaluatedItemDto);
  }

  @Auth(UserRole.TRAINER)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.evaluatedItemService.remove(id);
  }
}
