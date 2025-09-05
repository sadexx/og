import { IsString, IsNotEmpty, IsNumber, IsPositive, ValidateNested, IsUUID, MaxLength } from "class-validator";
import { Type } from "class-transformer";
import { ReadCustomExerciseDto } from "./read-custom-exercise.dto";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";

export class ReadLowerBodyMovementTypeDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @ValidateNested()
  @Type(() => ReadCustomExerciseDto)
  exercise: ReadCustomExerciseDto;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  met: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ordinalNumber: number;
}
