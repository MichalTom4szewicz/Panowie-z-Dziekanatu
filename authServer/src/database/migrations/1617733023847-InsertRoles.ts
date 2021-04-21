import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../../dataModel/Role";
import { UserRole } from "../entities/UserRole";
import {RolePermissionMapping} from "../../dataModel/RolePermissionMapping";
import {UserPermission} from "../entities/UserPermission";
import {Permission} from "../../dataModel/Permission";

export class InsertRoles1617733023847 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const entities = Role.values.map((userRole: Role) => {
            return new UserRole(
              userRole.id,
              userRole.name,
              RolePermissionMapping.getByRole(userRole)
            );
        });
        const permissions = Permission.values.map((permission) => {
            return new UserPermission(permission.id, permission.name);
        });
        await queryRunner.manager.save<UserPermission>(permissions);
        await queryRunner.manager.save<UserRole>(entities);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRoleDeletes = Role.values
          .map((role: Role) => queryRunner.manager.delete(UserRole, role.id));
        const permissionDeletes = Permission.values
          .map((permission: Permission) => queryRunner.manager.delete(UserPermission, permission.id));

        await Promise.all([...userRoleDeletes, ...permissionDeletes]);
    }
}
