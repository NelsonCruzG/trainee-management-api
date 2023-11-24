import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AssignmentModule } from '../assignment/assignment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), AssignmentModule],
  providers: [ItemService],
  controllers: [ItemController],
  exports: [ItemService]
})
export class ItemModule {}
