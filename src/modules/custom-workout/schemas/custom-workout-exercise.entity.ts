import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { EWorkoutExerciseType } from "../common/enums";
import { CustomWorkout } from "./custom-workout.entity";
import { ECircuit } from "../../workout-exercise/common/enums";

@Entity("custom_workout_exercise")
export class CustomWorkoutExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CustomWorkout, (customWorkout) => customWorkout.customExerciseOrder, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "custom_workout_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "custom_workout_exercise_custom_workout"
  })
  customWorkout: CustomWorkout;

  @Column({ type: "uuid", name: "custom_workout_exercise_on_phone_id" })
  customWorkoutExerciseOnPhoneId: string;

  @Column({ type: "uuid", name: "custom_primary_exercise_id", nullable: true })
  customPrimaryExerciseId: string | null;

  @Column({
    type: "uuid",
    name: "custom_secondary_exercise_id",
    nullable: true
  })
  customSecondaryExerciseId: string | null;

  @Column({ type: "json", name: "custom_primary_exercise", nullable: true })
  customPrimaryExercise: string | null;

  @Column({ type: "json", name: "custom_secondary_exercise", nullable: true })
  customSecondaryExercise: string | null;

  @Column({ type: "integer", name: "quantity" })
  quantity: number;

  @Column({ type: "integer", name: "sets" })
  sets: number;

  @Column({
    type: "enum",
    name: "circuit",
    enum: ECircuit
  })
  circuit: ECircuit;

  @Column({ type: "integer", name: "custom_rest_duration" })
  customRestDuration: number;

  @Column({ type: "real", name: "duration" })
  duration: number;

  @Column({
    type: "enum",
    name: "workout_exercise_type",
    enum: EWorkoutExerciseType
  })
  workoutExerciseType: EWorkoutExerciseType;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
