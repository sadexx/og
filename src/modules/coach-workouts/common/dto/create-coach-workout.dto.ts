import { IsUUID, IsOptional, IsString, IsNotEmpty, IsEnum } from "class-validator";
import { EDifficulty } from "../../../exercise/common/enums";
import { FocalBodyPart } from "../../../focal-body-parts/schemas";
import { WorkoutCategory } from "../../../workout-category/schemas";
import { EEnduranceLevel } from "../../../workout/common/enums";

export class CreateCoachWorkoutDto {
  @IsUUID()
  workoutCategoryId: WorkoutCategory;

  @IsOptional()
  @IsUUID()
  focalBodyPartId?: FocalBodyPart;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EDifficulty)
  difficulty: EDifficulty;

  @IsEnum(EEnduranceLevel)
  enduranceLevel: EEnduranceLevel;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsUUID()
  joggingDrillsStretchingId: string;

  @IsUUID()
  warmUpStretchingId: string;

  @IsUUID()
  coolDownStretchingId: string;
}
