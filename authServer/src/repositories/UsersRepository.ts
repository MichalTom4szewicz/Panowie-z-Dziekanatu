import {Connection, Repository} from "typeorm";
import {User} from "../database/entities/User";
import {UserRole} from "../database/entities/UserRole";

export class TokenContent {
  username: string;
  password: string;
  role: UserRole;
  exp?: number;
}

export class UsersRepository {
  private readonly _repository: Repository<User>;

  constructor(private _connection: Connection) {
    this._repository = this._connection.getRepository(User);
  }

  public async getUsers(): Promise<User[]> {
    return this._repository.find({ relations: ['userRole'] });
  }

  public async addUser(user: TokenContent): Promise<void> {
    try {
      const existingUser = await this.getUserById(user.username);
      if (!existingUser) {
        const savedUser = {
          username: user.username,
          password: user.password,
          userRole: user.role
        };
        await this._repository.save(savedUser as User);
      }
    } catch (e) {
      return Promise.reject(new Error("Cannot save user"));
    }
  }

  public async getUserById(id: string): Promise<TokenContent> {
    try {
      const result = await this._repository.findOne(id, { relations: ['userRole'] });
      if (result) {
        return {
          username: result.username,
          password: result.password,
          role: result.userRole
        };
      }
    } catch (e) {
      return Promise.reject(new Error("No such user"));
    }
  }
}
