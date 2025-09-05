import { Type } from "class-transformer";
import { IsEmpty, IsOptional, ValidateNested } from "class-validator";
import { ReadCustomWorkoutDto } from "./read-custom-workout.dto";
import { ReadCustomWorkoutSettingsDto } from "./read-custom-workout-settings.dto";

export class UpdateFavoriteWorkoutDto {
  @IsOptional()
  @IsEmpty()
  workoutOriginalId?: null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadCustomWorkoutDto)
  customWorkout?: ReadCustomWorkoutDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadCustomWorkoutSettingsDto)
  customWorkoutSettings?: ReadCustomWorkoutSettingsDto;
}
