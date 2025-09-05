import { IsOptional, IsNumber, IsEnum } from "class-validator";
import { ECompleteWorkoutWithPauseAfter } from "../../../settings/common/enums";

export class UpdateUserWorkoutSettingsDto {
  @IsOptional()
  @IsNumber()
  restDurationForLowEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  restDurationForMediumEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  restDurationForHighEffortLevelExercise?: number;

  @IsOptional()
  @IsNumber()
  restDurationForVigorousEffortLevelExercise?: number;

  @IsOptional()
  @IsEnum(ECompleteWorkoutWithPauseAfter)
  completeWorkoutWithPauseAfter?: ECompleteWorkoutWithPauseAfter;
}
