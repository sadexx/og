import { IsOptional, IsArray, ArrayMinSize, Validate, ArrayUnique, IsEnum } from "class-validator";
import { IsMultiDimensionalArray } from "../../../../common/helpers";
import { EDifficulty } from "../../../exercise/common/enums";

export class GetRandomWorkoutQueryDto {
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
}
