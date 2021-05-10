export class Permission {
  public static READ_CLASS: Permission = new Permission(1, 'READ_CLASS');
  public static CREATE_CLASS: Permission = new Permission(2, 'CREATE_CLASS');
  public static DELETE_CLASS: Permission = new Permission(3, 'DELETE_CLASS');
  public static ASSIGN_SELF: Permission = new Permission(4, 'ASSIGN_SELF');
  public static ASSIGN_OTHER: Permission = new Permission(5, 'ASSIGN_OTHER');
  public static REMOVE_ASSIGNMENT: Permission = new Permission(6, 'REMOVE_ASSIGNMENT');
  public static CREATE_ACCOUNT: Permission = new Permission(7, 'CREATE_ACCOUNT');

  private static _VALUES: Permission[] = [
    Permission.READ_CLASS,
    Permission.CREATE_CLASS,
    Permission.DELETE_CLASS,
    Permission.ASSIGN_SELF,
    Permission.ASSIGN_OTHER,
    Permission.REMOVE_ASSIGNMENT,
    Permission.CREATE_ACCOUNT
  ];

  constructor(private _id: number, private _name: string) {}

  public static getById(id: number): Permission {
    return Permission.values.find((permission) => permission.id === id);
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public static get values(): Permission[] {
    return Permission._VALUES;
  }
}
