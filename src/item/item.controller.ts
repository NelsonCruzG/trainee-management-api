import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';
import { User } from '../auth/decorator/user.decorator';

@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Auth(UserRole.DEVELOPER)
  @Get()
  findAll(@User('sub') idUser: number): Promise<Item[]> {
    return this.itemService.findAll(idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Get(':id')
  findOne(@Param('id') id: number, @User('sub') idUser: number): Promise<Item> {
    return this.itemService.findOne(id, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Post()
  create(
    @Body() createItemDto: CreateItemDto,
    @User('sub') idUser: number,
  ): Promise<Item> {
    return this.itemService.create(createItemDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
    @User('sub') idUser: number,
  ): Promise<Item> {
    return this.itemService.update(id, updateItemDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<void> {
    await this.itemService.remove(id, idUser);
  }
}
