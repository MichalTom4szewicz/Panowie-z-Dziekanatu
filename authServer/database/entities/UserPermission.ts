import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserPermission {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  @PrimaryGeneratedColumn({
    type: "integer"
  })
  id: number;

  @Column({
    type: "varchar"
  })
  name: string;
}
