import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { WorkoutCategory } from "../../../workout-category/schemas";
import { EDifficulty } from "../../../exercise/common/enums";
import { FocalBodyPart } from "../../../focal-body-parts/schemas";
import { EEnduranceLevel } from "../enums";

export class UpdateWorkoutDto {
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
