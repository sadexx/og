import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsEnum, ArrayUnique } from "class-validator";
import { LowerBodyMovementType } from "../../../lower-body-movement-type/schemas";
import { EFeatureKey } from "../enums";

export class UpdateWorkoutCategoryDto {
  @IsOptional()
  @ArrayUnique()
  focalBodyPartIds?: string[];

  @IsOptional()
  @IsString()
  defaultLowerBodyMovementTypeId?: LowerBodyMovementType;

  @IsOptional()
  @IsBoolean()
  isFocalBodyPartFilterEnabled?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  abbreviation?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  durationRangeSmallerNumber?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  durationRangeGreaterNumber?: number;

  @IsOptional()
  @IsBoolean()
  isLowerBodyMovementTypeEnabled?: boolean;

  @IsOptional()
  @IsEnum(EFeatureKey)
  featureKey?: EFeatureKey;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;
}
