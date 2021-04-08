import {Role} from "./Role";
import {Permission} from "./Permission";

export class RolePermissionMapping {
  private static readonly mapping: { [Key: number]: Permission[] } = {
    1: [Permission.ASSIGN_SELF, Permission.READ_CLASS],
    2: Permission.values
  };

  public static getByRole(role: Role): Permission[] {
    return RolePermissionMapping.mapping[role.id];
  }
}
