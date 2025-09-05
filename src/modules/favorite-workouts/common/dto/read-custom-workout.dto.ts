import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsPositive,
  MaxLength,
  IsOptional
} from "class-validator";
import { Type } from "class-transformer";
import { ReadCustomWorkoutExerciseDto } from "./read-custom-workout-exercise.dto";
import { ReadWorkoutCategoryDto } from "./read-workout-category.dto";
import { ReadFocalBodyPartDto } from "./read-focal-body-part.dto";
import { EDifficulty } from "../../../exercise/common/enums";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";
import { EEnduranceLevel } from "../../../workout/common/enums";

export class ReadCustomWorkoutDto {
  @IsUUID()
  customWorkoutOnPhoneId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReadWorkoutCategoryDto)
  workoutCategory: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReadCustomWorkoutExerciseDto)
  customExerciseOrder: ReadCustomWorkoutExerciseDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadFocalBodyPartDto)
  focalBodyPart: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  description: string;

  @IsEnum(EDifficulty)
  @IsNotEmpty()
  difficulty: EDifficulty;

  @IsEnum(EEnduranceLevel)
  @IsNotEmpty()
  enduranceLevel: EEnduranceLevel;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  duration: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  imageUrl: string;

  @IsNotEmpty()
  @IsUUID()
  joggingDrillsStretchingId: string;

  @IsNotEmpty()
  @IsUUID()
  warmUpStretchingId: string;

  @IsNotEmpty()
  @IsUUID()
  coolDownStretchingId: string;
}
