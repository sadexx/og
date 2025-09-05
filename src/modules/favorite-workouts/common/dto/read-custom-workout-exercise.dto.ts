import { IsNumber, IsEnum, IsUUID, ValidateNested, IsOptional, IsPositive, IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";
import { ReadCustomExerciseDto } from "./read-custom-exercise.dto";
import { EWorkoutExerciseType } from "../../../custom-workout/common/enums";
import { ECircuit } from "../../../workout-exercise/common/enums";

export class ReadCustomWorkoutExerciseDto {
  @IsUUID()
  @IsNotEmpty()
  customWorkoutExerciseOnPhoneId: string;

  @IsOptional()
  @IsUUID()
  customPrimaryExerciseId?: string | null;

  @IsOptional()
  @IsUUID()
  customSecondaryExerciseId?: string | null;

  @ValidateNested()
  @Type(() => ReadCustomExerciseDto)
  customPrimaryExercise: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadCustomExerciseDto)
  customSecondaryExercise?: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  sets: number;

  @IsEnum(ECircuit)
  @IsNotEmpty()
  circuit: ECircuit;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  customRestDuration: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  duration: number;

  @IsEnum(EWorkoutExerciseType)
  @IsNotEmpty()
  workoutExerciseType: EWorkoutExerciseType;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ordinalNumber: number;
}
