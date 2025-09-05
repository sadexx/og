import { IsUUID, IsString, IsNotEmpty, IsNumber, ValidateNested, Min } from "class-validator";
import { ReadCustomStretchingExerciseDto } from "./read-custom-stretching-exercise.dto";
import { Type } from "class-transformer";
import { ReadAudioDto } from "../../../favorite-workouts/common/dto";

export class CreateCustomStretchingDto {
  @IsUUID()
  @IsNotEmpty()
  customStretchingOnPhoneId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReadCustomStretchingExerciseDto)
  customExerciseOrder: ReadCustomStretchingExerciseDto[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  ordinalNumber: number;

  @IsString()
  @IsNotEmpty()
  startText: string;

  @IsString()
  @IsNotEmpty()
  endText: string;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  startAudio: string;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  endAudio: string;
}
