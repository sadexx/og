import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserDailyReport } from "../../users-daily-report/schemas";
import { UserExerciseDailyLog } from "../../users-exercise-daily-log/schemas";

@Entity({ name: "user_workout_daily_log" })
export class UserWorkoutDailyLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("user_daily_report_idx")
  @ManyToOne(() => UserDailyReport, (userDailyReport) => userDailyReport.workoutDetailLogs, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_daily_report_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_workout_daily_log_user_daily_report"
  })
  userDailyReport: UserDailyReport;

  @Column({ type: "uuid", name: "user_workout_daily_log_on_phone_id" })
  userWorkoutDailyLogOnPhoneId: string;

  @Column({ type: "uuid", name: "workout_id" })
  workoutId: string;

  @Column({ type: "uuid", name: "workout_original_id" })
  workoutOriginalId: string;

  @Column({ type: "varchar", name: "title" })
  title: string;

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

  @Column({ type: "real", name: "duration" })
  duration: number;

  @Column({ name: "total_number_of_intervals", type: "real", nullable: true })
  totalNumberOfIntervals: number;

  @Column({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @Column({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @Column({ type: "timestamp", name: "completion_date" })
  completionDate: Date;

  @OneToMany(() => UserExerciseDailyLog, (exerciseDailyLog) => exerciseDailyLog.userWorkoutDailyLog, { cascade: true })
  userExerciseDetailLogs: UserExerciseDailyLog[];
}
