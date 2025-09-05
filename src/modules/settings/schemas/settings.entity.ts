import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ECompleteWorkoutWithPauseAfter } from "../common/enums";

@Entity({ name: "settings" })
export class Settings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "real", name: "rest_duration_for_low_effort_level_exercise" })
  restDurationForLowEffortLevelExercise: number;

  @Column({
    type: "real",
    name: "rest_duration_for_medium_effort_level_exercise"
  })
  restDurationForMediumEffortLevelExercise: number;

  @Column({
    type: "real",
    name: "rest_duration_for_high_effort_level_exercise"
  })
  restDurationForHighEffortLevelExercise: number;

  @Column({
    type: "real",
    name: "rest_duration_for_vigorous_effort_level_exercise"
  })
  restDurationForVigorousEffortLevelExercise: number;

  @Column({ type: "real", name: "quantity_for_low_endurance_level_workout" })
  quantityForLowEnduranceLevelWorkout: number;

  @Column({ type: "real", name: "quantity_medium_endurance_level_workout" })
  quantityForMediumEnduranceLevelWorkout: number;

  @Column({ type: "real", name: "quantity_high_endurance_level_workout" })
  quantityForHighEnduranceLevelWorkout: number;

  @Column({ type: "real", name: "met_low_effort_level_exercise" })
  metForLowEffortLevelExercise: number;

  @Column({ type: "real", name: "met_medium_effort_level_exercise" })
  metForMediumEffortLevelExercise: number;

  @Column({ type: "real", name: "met_high_effort_level_exercise" })
  metForHighEffortLevelExercise: number;

  @Column({ type: "real", name: "met_vigorous_effort_level_exercise" })
  metForVigorousEffortLevelExercise: number;

  @Column({ type: "real", name: "circuit_break_duration" })
  circuitBreakDuration: number;

  @Column({
    type: "enum",
    name: "complete_workout_with_pause_after",
    enum: ECompleteWorkoutWithPauseAfter
  })
  completeWorkoutWithPauseAfter: ECompleteWorkoutWithPauseAfter;

  @Column({
    type: "real",
    name: "right_grip_adjustment_coefficient"
  })
  rightGripAdjustmentCoefficient: number;

  @Column({
    type: "real",
    name: "left_grip_adjustment_coefficient"
  })
  leftGripAdjustmentCoefficient: number;
}
