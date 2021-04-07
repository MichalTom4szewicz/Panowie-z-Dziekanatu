export class Role {
  public static readonly USER: Role = new Role(1, "USER");
  public static readonly GOD: Role = new Role(2, "GOD");

  private static readonly _VALUES = [Role.USER, Role.GOD];

  constructor(private _id: number, private _name: string) {}

  public static getById(id: number): Role {
    return Role._VALUES.find((value: Role) => value._id === id);
  }

  public static get values(): Role[] {
    return Role._VALUES;
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
}
