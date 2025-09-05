import { Type } from "class-transformer";
import { IsUUID, IsNumber, ValidateNested, IsOptional, IsNotEmpty, Min } from "class-validator";
import { ReadCustomExerciseDto } from "../../../favorite-workouts/common/dto";

export class ReadCustomStretchingExerciseDto {
  @IsUUID()
  @IsNotEmpty()
  customStretchingExerciseOnPhoneId: string;

  @IsOptional()
  @IsUUID()
  customExerciseId?: string | null;

  @ValidateNested()
  @Type(() => ReadCustomExerciseDto)
  customExercise: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  customRestDuration: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  ordinalNumber: number;
}
