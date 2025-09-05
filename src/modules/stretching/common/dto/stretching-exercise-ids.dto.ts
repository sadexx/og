import { IsString, IsArray, ArrayNotEmpty, ArrayUnique, IsUUID } from "class-validator";
import { UUID_VERSION } from "../../../../common/constants";

export class StretchingExerciseIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsUUID(UUID_VERSION, { each: true })
  stretchingExerciseIds?: string[];
}
