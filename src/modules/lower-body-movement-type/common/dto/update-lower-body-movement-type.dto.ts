import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Exercise } from "../../../exercise/schemas";

export class UpdateLowerBodyMovementTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsUUID()
  exerciseId?: Exercise;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  met?: number;
}

/**
 * Schema for updating a lower body movement in router
 */
