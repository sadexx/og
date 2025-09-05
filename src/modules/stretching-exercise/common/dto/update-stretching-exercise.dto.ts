import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";

export class UpdateStretchingExerciseDto {
  @IsOptional()
  @IsUUID()
  exerciseId?: Exercise;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  quantity?: number;
}
