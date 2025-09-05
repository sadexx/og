import { IsOptional, IsArray, ArrayMinSize, Validate, IsUUID, ArrayUnique, IsEnum } from "class-validator";
import { IsMultiDimensionalArray } from "../../../../common/helpers";
import { EDifficulty } from "../../../exercise/common/enums";
import { UUID_VERSION } from "../../../../common/constants";
import { PaginationQueryDto } from "../../../../common/dto";

export class GetWorkoutInCategoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Validate(IsMultiDimensionalArray)
  durationRanges?: number[][];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsEnum(EDifficulty, { each: true })
  difficulties?: EDifficulty[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(UUID_VERSION, { each: true })
  focalBodyPartIds?: string[];
}
