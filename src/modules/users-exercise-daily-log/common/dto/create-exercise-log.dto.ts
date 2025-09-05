import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EQuantityUnit } from "../../../exercise/common/enums";
import { UserWorkoutDailyLog } from "../../../users-workout-daily-log/schemas";

export class CreateExerciseDailyLogDto {
  @ValidateNested()
  @Type(() => UserWorkoutDailyLog)
  userWorkoutDailyLog: UserWorkoutDailyLog;

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
  totalCompletedQuantity: number;

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

  @IsDate()
  @IsNotEmpty()
  createdDate: Date;

  @IsDate()
  @IsNotEmpty()
  completionDate: Date;
}
