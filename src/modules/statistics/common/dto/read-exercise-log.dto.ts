import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum, IsUUID } from "class-validator";
import { EQuantityUnit } from "../../../exercise/common/enums";

export class ReadExerciseDailyLogDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userExerciseDailyLogOnPhoneId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  workoutExerciseId: string;

  @IsNumber()
  @IsNotEmpty()
  ordinalNumber: number;

  @IsString()
  @IsNotEmpty()
  primaryExerciseTitle: string;

  @IsEnum(EQuantityUnit)
  primaryExerciseQuantityUnit: EQuantityUnit;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secondaryExerciseTitle?: string;

  @IsString()
  @IsNotEmpty()
  circuit: string;

  @IsNumber()
  @IsNotEmpty()
  set: number;

  @IsNumber()
  @IsNotEmpty()
  strain: number;

  @IsNumber()
  @IsNotEmpty()
  lastMaxStrain: number;

  @IsNumber()
  @IsNotEmpty()
  maxStrain: number;

  @IsNumber()
  @IsNotEmpty()
  avgMaxStrain: number;

  @IsNumber()
  @IsNotEmpty()
  completedQuantityWithBluetoothConnection: number;

  @IsNumber()
  @IsNotEmpty()
  completedQuantityWithoutBluetoothConnection: number;

  @IsNumber()
  @IsNotEmpty()
  targetQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  caloriesBurned: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  restDuration: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  @IsNotEmpty()
  createdDate: Date;

  @IsDateString()
  @IsNotEmpty()
  completionDate: Date;
}
