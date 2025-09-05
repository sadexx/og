import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class CreateActivityTypeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  shortTitle?: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @IsBoolean()
  includeTareValue: boolean;

  @IsNumber()
  @IsNotEmpty()
  activityIndex: number;

  @IsNumber()
  @IsNotEmpty()
  additionalTareValue: number;

  @IsBoolean()
  isRoundingOfStrainValuesEnabled: boolean;
}
