import { IsArray, ArrayNotEmpty, ArrayUnique, IsString, IsUUID } from "class-validator";
import { UUID_VERSION } from "../../../../common/constants";

export class JustMetricsWorkoutExerciseTypeIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsUUID(UUID_VERSION, { each: true })
  justMetricsWorkoutExerciseTypeIds?: string[];
}
