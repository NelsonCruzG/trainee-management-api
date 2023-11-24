import { Rol } from '../../rol/entities/rol.entity';

export interface IUserPayloadToken {
  sub: number;
  email: string;
  roles: Rol[];
  jti: string;
  exp: Date;
}
