import {Connection, Repository} from 'typeorm';
import {UserRole} from '../database/entities/UserRole';

export class RoleRepository {
  private readonly _repository: Repository<UserRole>

  constructor(private _connection: Connection) {
    this._repository = this._connection.getRepository(UserRole);
  }

  public getRoleByName(roleName: string): Promise<UserRole> {
    return this._repository.findOne({ where: { name: roleName }});
  }
}
