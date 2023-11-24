import { User } from '../../user/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'rol_id' })
  rolId: number;

  @Column()
  rol: string;

  @ManyToMany((type) => User, (user) => user.roles)
  users: User[];
}
