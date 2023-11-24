import { ProgramService } from './program.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';

@ApiTags('Programs')
@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Auth(UserRole.MANAGER)
  @Get()
  findPrograms(): Promise<Program[]> {
    return this.programService.findPrograms();
  }

  @Auth(UserRole.MANAGER)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Program> {
    return this.programService.findOne(id);
  }

  @Auth(UserRole.MANAGER)
  @Post()
  create(@Body() createProgramDto: CreateProgramDto): Promise<Program> {
    return this.programService.createNewProgram(createProgramDto);
  }

  @Auth(UserRole.MANAGER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProgramDto: UpdateProgramDto,
  ): Promise<Program> {
    return this.programService.update(id, updateProgramDto);
  }
}
