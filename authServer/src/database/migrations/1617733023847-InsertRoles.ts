import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../../dataModel/Role";
import { UserRole } from "../entities/UserRole";
import {RolePermissionMapping} from "../../dataModel/RolePermissionMapping";
import {UserPermission} from "../entities/UserPermission";
import {Permission} from "../../dataModel/Permission";
import {User} from "../entities/User";

export class InsertRoles1617733023847 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const entities = Role.values.map((userRole) => {
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
        await queryRunner.manager.delete(User, 1);
        await queryRunner.manager.delete(User, 2);

    }
}
