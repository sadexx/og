import { IsNotEmpty, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { ReadCustomWorkoutSettingsDto } from "./read-custom-workout-settings.dto";
import { Type } from "class-transformer";
import { ReadCustomWorkoutDto } from "./read-custom-workout.dto";

export class CreateFavoriteWorkoutDto {
  @IsNotEmpty()
  @IsUUID()
  customFavoriteWorkoutOnPhoneId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  workoutOriginalId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadCustomWorkoutDto)
  customWorkout?: ReadCustomWorkoutDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadCustomWorkoutSettingsDto)
  customWorkoutSettings?: ReadCustomWorkoutSettingsDto;
}
