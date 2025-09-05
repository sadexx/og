import { IsDate, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { User } from "../../../users/schemas";

export class CreateUserDailyReportDto {
  @ValidateNested()
  @Type(() => User)
  user: User;

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
  totalDuration: number;

  @IsNumber()
  @IsNotEmpty()
  totalNumberOfIntervals: number;

  @IsDate()
  @IsNotEmpty()
  createdDate: Date;
}
