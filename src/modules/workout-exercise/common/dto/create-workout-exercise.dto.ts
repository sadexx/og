import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";
import { ECircuit } from "../enums";

export class CreateWorkoutExerciseDto {
  @IsUUID()
  workoutId: string;

  @IsUUID()
  primaryExerciseId: Exercise;

  @IsOptional()
  @IsUUID()
  secondaryExerciseId?: Exercise;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  sets: number;

  @IsEnum(ECircuit)
  circuit: ECircuit;
}
