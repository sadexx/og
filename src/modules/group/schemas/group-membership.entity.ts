import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { EGroupMembershipRole } from "../common/enums";
import { Group } from "./group.entity";
import { User } from "../../users/schemas";
import { GroupMembershipStatistic } from "../../group-statistic/schemas";

@Entity({ name: "group_membership" })
export class GroupMembership {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    name: "role",
    enum: EGroupMembershipRole
  })
  role: EGroupMembershipRole;

  @ManyToOne(() => Group, (group) => group.groupMemberships, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "group_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "group_member_group"
  })
  group: Group;

  @ManyToOne(() => User, (user) => user.groupMemberships, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_group_membership"
  })
  user: User;

  @OneToMany(() => GroupMembershipStatistic, (groupMembershipStatistic) => groupMembershipStatistic.groupMembership, {
    nullable: true
  })
  groupMembershipStatistics: GroupMembershipStatistic[];

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
