import {
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsPositive,
  ValidateNested,
  MaxLength
} from "class-validator";
import { Type } from "class-transformer";
import { ReadLowerBodyMovementTypeDto } from "./read-lower-body-movement-type.dto";
import { ReadFocalBodyPartDto } from "./read-focal-body-part.dto";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";
import { EFeatureKey } from "../../../workout-category/common/enums";

export class ReadWorkoutCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => ReadFocalBodyPartDto)
  focalBodyParts: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadLowerBodyMovementTypeDto)
  defaultLowerBodyMovementType?: ReadLowerBodyMovementTypeDto;

  @IsBoolean()
  isFocalBodyPartFilterEnabled: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  abbreviation: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  durationRangeSmallerNumber: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  durationRangeGreaterNumber: number;

  @IsBoolean()
  isLowerBodyMovementTypeEnabled: boolean;

  @IsEnum(EFeatureKey)
  featureKey: EFeatureKey;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  imageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ordinalNumber: number;
}
