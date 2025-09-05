import { IsOptional, IsUUID, IsString, IsNotEmpty, IsEnum } from "class-validator";
import { EDifficulty } from "../../../exercise/common/enums";
import { FocalBodyPart } from "../../../focal-body-parts/schemas";
import { WorkoutCategory } from "../../../workout-category/schemas";
import { EEnduranceLevel } from "../../../workout/common/enums";

export class UpdateCoachWorkoutDto {
  @IsOptional()
  @IsUUID()
  workoutCategoryId?: WorkoutCategory;

  @IsOptional()
  @IsUUID()
  focalBodyPartId?: FocalBodyPart;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(EDifficulty)
  difficulty?: EDifficulty;

  @IsOptional()
  @IsEnum(EEnduranceLevel)
  enduranceLevel?: EEnduranceLevel;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

  @IsOptional()
  @IsUUID()
  joggingDrillsStretchingId?: string;

  @IsOptional()
  @IsUUID()
  warmUpStretchingId?: string;

  @IsOptional()
  @IsUUID()
  coolDownStretchingId?: string;
}
