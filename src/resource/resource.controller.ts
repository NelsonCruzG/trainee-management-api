import { ResourceService } from './resource.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Resource } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';
import { User } from '../auth/decorator/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Resources')
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Auth(UserRole.DEVELOPER)
  @Get()
  findAll(@User('sub') idUser: number): Promise<Resource[]> {
    return this.resourceService.findAll(idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<Resource> {
    return this.resourceService.findOne(id, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Post()
  create(
    @Body() createResourceDto: CreateResourceDto,
    @User('sub') idUser: number,
  ): Promise<Resource> {
    return this.resourceService.create(createResourceDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateResourceDto: UpdateResourceDto,
    @User('sub') idUser: number,
  ): Promise<Resource> {
    return this.resourceService.update(id, updateResourceDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<void> {
    await this.resourceService.remove(id, idUser);
  }
}
