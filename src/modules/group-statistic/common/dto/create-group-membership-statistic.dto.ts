import { IsNotEmpty, IsNumber, IsDateString } from "class-validator";

export class CreateGroupMembershipStatisticDto {
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
  totalDuration: number;

  @IsNumber()
  @IsNotEmpty()
  totalNumberOfIntervals: number;

  @IsDateString()
  @IsNotEmpty()
  createdDate: Date;
}
