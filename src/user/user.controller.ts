import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UserService } from './user.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserRole } from '../rol/entities/rols.enum';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(UserRole.MANAGER)
  @Get('employees')
  findAllEmployees(): Promise<User[]> {
    return this.userService.findAllEmployees();
  }

  @Auth(UserRole.MANAGER)
  @Post('employees')
  createEmployee(@Body() createUserDto: CreateEmployeeDto): Promise<User> {
    return this.userService.createEmployee(createUserDto);
  }

  @Auth(UserRole.MANAGER)
  @Patch('employees/:id')
  updateEmployee(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    return this.userService.updateEmployee(id, updateEmployeeDto);
  }  

  @Auth(UserRole.MANAGER)
  @Get('trainees')
  findAllTrainees(): Promise<User[]> {
    return this.userService.findAllTrainees();
  }

  @Auth(UserRole.MANAGER)
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Auth(UserRole.MANAGER)
  @Post('trainees')
  createTrainee(@Body() createTraineeDto: CreateTraineeDto): Promise<User> {
    return this.userService.createTrainee(createTraineeDto);
  }

  @Auth(UserRole.MANAGER)
  @Patch('trainees/:id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Auth(UserRole.MANAGER)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
