import { ArrayUnique, IsArray, IsEnum, IsUUID } from "class-validator";
import { UUID_VERSION } from "../../../../common/constants";
import { EDifficulty } from "../enums";

export class GetWildCardExerciseQueryDto {
  @IsUUID()
  activityTypeId: string;

  @IsEnum(EDifficulty)
  difficulty: EDifficulty;

  @IsArray()
  @ArrayUnique()
  @IsUUID(UUID_VERSION, { each: true })
  excludeIds: string[];
}
