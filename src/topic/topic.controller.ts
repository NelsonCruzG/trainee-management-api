import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';
import { User } from '../auth/decorator/user.decorator';

@ApiTags('Topics')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Auth(UserRole.DEVELOPER)
  @Get()
  findAll(@User('sub') idUser: number): Promise<Topic[]> {
    return this.topicService.findAll(idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<Topic> {
    return this.topicService.findOne(id, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Post()
  create(
    @Body() createTopicDto: CreateTopicDto,
    @User('sub') idUser: number,
  ): Promise<Topic> {
    return this.topicService.create(createTopicDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto,
    @User('sub') idUser: number,
  ): Promise<Topic> {
    return this.topicService.update(id, updateTopicDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<void> {
    await this.topicService.remove(id, idUser);
  }
}
