import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/schemas";
import { UserWorkoutDailyLog } from "../../users-workout-daily-log/schemas";

@Entity({ name: "user_daily_report" })
export class UserDailyReport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("user_daily_report_history_idx")
  @ManyToOne(() => User, (user) => user.dailyReportHistory, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_daily_report_user"
  })
  user: User;

  @Column({ type: "integer", name: "total_strain" })
  totalStrain: number;

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

  @Column({ name: "total_number_of_intervals", type: "real", nullable: true })
  totalNumberOfIntervals: number;

  @Column({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "update_date" })
  updateDate: Date;

  @OneToMany(() => UserWorkoutDailyLog, (workoutDailyLog) => workoutDailyLog.userDailyReport, {
    cascade: true,
    nullable: true
  })
  workoutDetailLogs: UserWorkoutDailyLog[];
}
