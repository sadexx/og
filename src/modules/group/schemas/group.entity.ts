import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMembership } from "./group-membership.entity";

@Entity({ name: "group" })
export class Group {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "name", unique: true })
  name: string;

  @Column({ type: "varchar", name: "password" })
  password: string;

  @Column({ type: "integer", name: "members_count", default: 0 })
  membersCount: number;

  @OneToMany(() => GroupMembership, (groupMembership) => groupMembership.group)
  groupMemberships: GroupMembership[];

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
