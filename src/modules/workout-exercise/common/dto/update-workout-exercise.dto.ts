import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";
import { ECircuit } from "../enums";

export class UpdateWorkoutExerciseDto {
  @IsOptional()
  @IsUUID()
  primaryExerciseId?: Exercise;

  @IsOptional()
  @IsUUID()
  secondaryExerciseId?: Exercise;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  sets?: number;

  @IsOptional()
  @IsEnum(ECircuit)
  circuit?: ECircuit;
}
