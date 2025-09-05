import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateActivityTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  shortTitle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  abbreviation?: string;

  @IsOptional()
  @IsBoolean()
  includeTareValue?: boolean;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  activityIndex?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  additionalTareValue?: number;

  @IsOptional()
  @IsBoolean()
  isRoundingOfStrainValuesEnabled?: boolean;
}
