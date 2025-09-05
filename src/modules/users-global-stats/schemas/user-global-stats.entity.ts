import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/schemas";

@Entity({ name: "user_global_stats" })
export class UserGlobalStats {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("stats_users_id_idx")
  @OneToOne(() => User, (user) => user.totalStatistics, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_global_stats_user"
  })
  user: User;

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
    name: "total_completed_quantity_without_bluetooth_connection",
    type: "real"
  })
  totalCompletedQuantityWithoutBluetoothConnection: number;

  @Column({ name: "total_calories_burned", type: "real" })
  totalCaloriesBurned: number;

  @Column({ name: "total_duration", type: "real" })
  totalDuration: number;

  @Column({ name: "total_number_of_intervals", type: "real", nullable: true })
  totalNumberOfIntervals: number;

  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "update_date" })
  updateDate: Date;
}
