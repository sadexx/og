import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";

export class CreateStretchingExerciseDto {
  @IsUUID()
  stretchingId: string;

  @IsUUID()
  exerciseId: Exercise;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
