import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ModuleEntity } from './entities/module.entity';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorator/user.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';

@ApiTags('Modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Auth(UserRole.DEVELOPER)
  @Get()
  findAll(@User('sub') idUser: number): Promise<ModuleEntity[]> {
    return this.moduleService.findAll(idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<ModuleEntity> {
    return this.moduleService.findOne(id, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Post()
  create(
    @Body() createModuleDto: CreateModuleDto,
    @User('sub') idUser: number,
  ): Promise<ModuleEntity> {
    return this.moduleService.create(createModuleDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateModuleDto: UpdateModuleDto,
    @User('sub') idUser: number,
  ): Promise<ModuleEntity> {
    return this.moduleService.update(id, updateModuleDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<void> {
    await this.moduleService.remove(id, idUser);
  }
}
