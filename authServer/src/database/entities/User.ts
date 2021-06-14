import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
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

  @ManyToOne(() => UserRole)
  @JoinColumn()
  public userRole: UserRole;
}
