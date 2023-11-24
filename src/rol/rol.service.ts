import {
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { UserRole, EmployeeRoles } from './entities/rols.enum';

@Injectable()
export class RolService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async onModuleInit() {
    const existingValues = await this.rolesRepository.find();
    const existingRoles = existingValues.map(this.getRolName);
    const userRoles = Object.values(UserRole);
    const toInsertRoles = userRoles.filter(
      (rol) => !existingRoles.includes(rol),
    );

    return Promise.all(
      toInsertRoles.map((rol) => this.rolesRepository.save({ rol })),
    );
  }

  getRolName(rol: Rol) {
    return rol.rol;
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolesRepository.findOne(id);
    if (!rol) {
      throw new NotFoundException(`Rol with ID #${id} not found`);
    }
    return rol;
  }

  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolesRepository.remove(rol);
  }

  async preloadRolesByName(rol: string): Promise<Rol> {
    return this.rolesRepository.findOne({ rol });
  }

  async findRoles(roles: EmployeeRoles[]) {
    return this.rolesRepository.find({
      where: { rol: In(roles) },
    });
  }
}
