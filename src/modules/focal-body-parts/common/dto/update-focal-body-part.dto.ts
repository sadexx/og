import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { EDifficulty } from "../../../exercise/common/enums";

export class UpdateFocalBodyPartDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsEnum(EDifficulty)
  difficulty?: EDifficulty;
}
