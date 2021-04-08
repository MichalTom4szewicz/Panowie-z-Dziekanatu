import {Connection, Repository} from "typeorm";
import {User} from "../database/entities/User";

export class TokenContent {
  username: string;
  password: string;
}

export class UsersRepository {
  private readonly _repository: Repository<User>;

  constructor(private _connection: Connection) {
    this._repository = this._connection.getRepository(User);
  }

  public async getUsers(): Promise<User[]> {
    return this._repository.find();
  }

  public async addUser(user: TokenContent): Promise<void> {
    try {
      await this._repository.save(user as User);
    } catch (e) {
      return Promise.reject(new Error("Cannot save user"));
    }
  }

  public async getUserById(id: string): Promise<TokenContent> {
    try {
      const result = await this._repository.findOneOrFail(id);
      return {
        username: result.username,
        password: result.password
      };
    } catch (e) {
      return Promise.reject(new Error("No such user"));
    }
  }
}
