import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";

export class CreateLowerBodyMovementTypeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  exerciseId: Exercise;

  @IsNumber()
  @IsNotEmpty()
  met: number;
}
