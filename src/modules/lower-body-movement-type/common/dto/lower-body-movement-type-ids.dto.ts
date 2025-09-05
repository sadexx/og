import { ArrayNotEmpty, ArrayUnique, IsArray, IsString, IsUUID } from "class-validator";
import { UUID_VERSION } from "../../../../common/constants";

export class LowerBodyMovementTypeIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsUUID(UUID_VERSION, { each: true })
  lowerBodyMovementTypeIds: string[];
}
