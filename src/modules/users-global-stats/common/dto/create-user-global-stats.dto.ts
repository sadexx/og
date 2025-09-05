import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { User } from "../../../users/schemas";

export class CreateUserGlobalStatsDto {
  @ValidateNested()
  @Type(() => User)
  user: User;

  @IsString()
  totalStrain: bigint;

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
}
