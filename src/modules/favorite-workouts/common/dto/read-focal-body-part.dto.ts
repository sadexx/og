import { IsString, IsNotEmpty, IsEnum, IsUUID, MaxLength } from "class-validator";
import { EDifficulty } from "../../../exercise/common/enums";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";

export class ReadFocalBodyPartDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsEnum(EDifficulty)
  difficulty: EDifficulty;
}
