export interface User {
  username: string,
  password: string,
}

export class UsersRepository {
  private _users: User[] = [];

  public getUserByUsername(username: string): User {
    return this._users.find(user => user.username === username);
  }

  public addUser(user: User): void {
    this._users.push(user);
  }
}
