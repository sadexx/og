import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsDate, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { UserDailyReport } from "../../../users-daily-report/schemas";

export class CreateWorkoutDailyLogDto {
  @ValidateNested()
  @Type(() => UserDailyReport)
  userDailyReport: UserDailyReport;

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
  totalCompletedQuantity: number;

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

  @IsDate()
  @IsNotEmpty()
  createdDate: Date;

  @IsDate()
  @IsNotEmpty()
  updatedDate: Date;

  @IsDate()
  @IsNotEmpty()
  completionDate: Date;
}
