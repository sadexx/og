import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ECompleteWorkoutWithPauseAfter } from "../enums";

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  restDurationForLowEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  restDurationForMediumEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  restDurationForHighEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  restDurationForVigorousEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  quantityForLowEnduranceLevelWorkout?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  quantityForMediumEnduranceLevelWorkout?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  quantityForHighEnduranceLevelWorkout?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  metForLowEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  metForMediumEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  metForHighEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  metForVigorousEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  circuitBreakDuration?: number;

  @IsOptional()
  @IsEnum(ECompleteWorkoutWithPauseAfter)
  completeWorkoutWithPauseAfter?: ECompleteWorkoutWithPauseAfter;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  rightGripAdjustmentCoefficient?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  leftGripAdjustmentCoefficient?: number;
}
