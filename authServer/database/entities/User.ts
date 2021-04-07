import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {UserRole} from "./UserRole";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({
    type: "varchar"
  })
  public username: string;

  @Column({
    type: "varchar"
  })
  public password: string;

  @OneToOne(() => UserRole)
  @JoinColumn()
  public userRole: UserRole;
}
