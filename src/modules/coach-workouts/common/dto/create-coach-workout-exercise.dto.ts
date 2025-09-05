import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";
import { ECircuit } from "../../../workout-exercise/common/enums";

export class CreateCoachWorkoutExerciseDto {
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
