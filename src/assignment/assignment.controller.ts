import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorator/user.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Auth(UserRole.DEVELOPER)
  @Get()
  findAll(@User('sub') idUser: number): Promise<Assignment[]> {
    return this.assignmentService.findAll(idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Get(':id')
  findOne(
    @Param('id') idAssignment: number,
    @User('sub') idUser: number,
  ): Promise<Assignment> {
    return this.assignmentService.findOne(idAssignment, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Post()
  create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @User('sub') idUser: number,
  ): Promise<Assignment> {
    return this.assignmentService.create(createAssignmentDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @User('sub') idUser: number,
  ): Promise<Assignment> {
    return this.assignmentService.update(id, updateAssignmentDto, idUser);
  }

  @Auth(UserRole.DEVELOPER)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User('sub') idUser: number,
  ): Promise<void> {
    await this.assignmentService.remove(id, idUser);
  }
}
