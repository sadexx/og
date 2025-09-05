import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsDateString, IsUUID } from "class-validator";
import { ReadExerciseDailyLogDto } from "./read-exercise-log.dto";

export class ReadStatisticsDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userWorkoutDailyLogOnPhoneId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  workoutId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  workoutOriginalId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  totalStrain: number;

  @IsNumber()
  @IsNotEmpty()
  totalMaxStrain: number;

  @IsNumber()
  @IsNotEmpty()
  totalAvgMaxStrain: number;

  @IsNumber()
  @IsNotEmpty()
  totalCompletedQuantityWithBluetoothConnection: number;

  @IsNumber()
  @IsNotEmpty()
  totalCompletedQuantityWithoutBluetoothConnection: number;

  @IsNumber()
  @IsNotEmpty()
  totalCaloriesBurned: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  totalNumberOfIntervals: number;

  @IsDateString()
  @IsNotEmpty()
  createdDate: Date;

  @IsDateString()
  @IsNotEmpty()
  updatedDate: Date;

  @IsDateString()
  @IsNotEmpty()
  completionDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadExerciseDailyLogDto)
  workoutExerciseLogs: ReadExerciseDailyLogDto[];
}
