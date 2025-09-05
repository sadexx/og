import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";
import { ECircuit } from "../../../workout-exercise/common/enums";

export class UpdateCoachWorkoutExerciseDto {
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
