import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EQuantityUnit } from "../../exercise/common/enums";
import { UserWorkoutDailyLog } from "../../users-workout-daily-log/schemas";

@Entity({ name: "user_exercises_daily_log" })
export class UserExerciseDailyLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("user_workout_daily_logs_idx")
  @ManyToOne(() => UserWorkoutDailyLog, (workoutDailyLog) => workoutDailyLog.userExerciseDetailLogs, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_workout_daily_log_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_exercises_daily_log_user_workout_daily_log"
  })
  userWorkoutDailyLog: UserWorkoutDailyLog;

  @Column({ type: "uuid", name: "user_exercise_daily_log_on_phone_id" })
  userExerciseDailyLogOnPhoneId: string;

  @Column({ type: "uuid", name: "workout_exercise_id" })
  workoutExerciseId: string;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @Column({ type: "varchar", name: "primary_exercise_title" })
  primaryExerciseTitle: string;

  @Column({
    type: "enum",
    name: "primary_exercise_quantity_unit",
    enum: EQuantityUnit
  })
  primaryExerciseQuantityUnit: EQuantityUnit;

  @Column({ type: "varchar", name: "secondary_exercise_title", nullable: true })
  secondaryExerciseTitle: string;

  @Column({ type: "varchar", name: "circuit" })
  circuit: string;

  @Column({ type: "integer", name: "set" })
  set: number;

  @Column({ type: "integer", name: "strain" })
  strain: number;

  @Column({ type: "integer", name: "last_max_strain" })
  lastMaxStrain: number;

  @Column({ type: "integer", name: "max_strain" })
  maxStrain: number;

  @Column({ type: "integer", name: "avg_max_strain" })
  avgMaxStrain: number;

  @Column({ type: "real", name: "total_completed_quantity" })
  totalCompletedQuantity: number;

  @Column({
    type: "real",
    name: "completed_quantity_with_bluetooth_connection"
  })
  completedQuantityWithBluetoothConnection: number;

  @Column({
    type: "real",
    name: "completed_quantity_without_bluetooth_connection"
  })
  completedQuantityWithoutBluetoothConnection: number;

  @Column({ type: "integer", name: "target_quantity" })
  targetQuantity: number;

  @Column({ type: "real", name: "calories_burned" })
  caloriesBurned: number;

  @Column({ type: "real", name: "duration" })
  duration: number;

  @Column({ type: "real", name: "rest_duration" })
  restDuration: number;

  @Column({ type: "varchar", name: "notes", nullable: true })
  notes: string;

  @Column({ type: "timestamp", name: "completion_date" })
  completionDate: Date;

  @Column({ type: "timestamp", name: "created_date" })
  createdDate: Date;
}
