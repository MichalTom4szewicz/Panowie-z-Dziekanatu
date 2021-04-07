import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserPermission} from "./UserPermission";

@Entity()
export class UserRole {
  constructor(id: number, name: string, permissions: UserPermission[]) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
  }

  @PrimaryGeneratedColumn({
    type: "integer"
  })
  id: number;

  @Column({
    type: "varchar"
  })
  name: string;

  @ManyToMany(() => UserPermission)
  @JoinTable()
  permissions: UserPermission[]
}
