import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './entities/users.entity';
import { UserService } from './user.service';
import { RolModule } from '../rol/rol.module';
import { Execution } from '../execution/entities/execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Execution]), RolModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
