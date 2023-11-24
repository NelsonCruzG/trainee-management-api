import { User } from '../../user/entities/users.entity';

export interface ProgramManager {
  readonly name: string;
  readonly management: boolean;
  readonly users: User[];
}
