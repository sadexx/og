import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMembership } from "../../group/schemas";
import { EGroupMembershipStatisticPeriod } from "../common/enums";

@Entity({ name: "group_membership_statistic" })
export class GroupMembershipStatistic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "bigint", name: "total_strain" })
  totalStrain: bigint;

  @Column({ type: "integer", name: "total_max_strain" })
  totalMaxStrain: number;

  @Column({ type: "integer", name: "total_avg_max_strain" })
  totalAvgMaxStrain: number;

  @Column({ type: "real", name: "total_completed_quantity" })
  totalCompletedQuantity: number;

  @Column({
    type: "real",
    name: "total_completed_quantity_with_bluetooth_connection"
  })
  totalCompletedQuantityWithBluetoothConnection: number;

  @Column({
    type: "real",
    name: "total_completed_quantity_without_bluetooth_connection"
  })
  totalCompletedQuantityWithoutBluetoothConnection: number;

  @Column({ type: "real", name: "total_calories_burned" })
  totalCaloriesBurned: number;

  @Column({ type: "real", name: "total_duration" })
  totalDuration: number;

  @Column({ name: "total_number_of_intervals", type: "real" })
  totalNumberOfIntervals: number;

  @Column({
    type: "enum",
    name: "statistic_period",
    enum: EGroupMembershipStatisticPeriod
  })
  statisticPeriod: EGroupMembershipStatisticPeriod;

  @Column({ type: "date", name: "period_date" })
  periodDate: Date;

  @Column({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "update_date" })
  updateDate: Date;

  @Index("group_membership_statistic_idx")
  @ManyToOne(() => GroupMembership, (groupMembership) => groupMembership.groupMembershipStatistics, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "group_membership_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "group_membership_group_membership_statistic"
  })
  groupMembership: GroupMembership;
}
