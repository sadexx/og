import { IsString, IsNotEmpty, IsEnum, IsUUID, IsOptional } from "class-validator";
import { WorkoutCategory } from "../../../workout-category/schemas";
import { EDifficulty } from "../../../exercise/common/enums";
import { FocalBodyPart } from "../../../focal-body-parts/schemas";
import { EEnduranceLevel } from "../enums";

export class CreateWorkoutDto {
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
