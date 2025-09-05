import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsEnum, ArrayUnique, IsOptional } from "class-validator";
import { LowerBodyMovementType } from "../../../lower-body-movement-type/schemas";
import { EFeatureKey } from "../enums";

export class CreateWorkoutCategoryDto {
  @ArrayUnique()
  focalBodyPartIds: string[];

  @IsOptional()
  @IsString()
  defaultLowerBodyMovementTypeId?: LowerBodyMovementType;

  @IsBoolean()
  isFocalBodyPartFilterEnabled: boolean;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  durationRangeSmallerNumber: number;

  @IsNumber()
  @IsNotEmpty()
  durationRangeGreaterNumber: number;

  @IsBoolean()
  isLowerBodyMovementTypeEnabled: boolean;

  @IsEnum(EFeatureKey)
  featureKey: EFeatureKey;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
