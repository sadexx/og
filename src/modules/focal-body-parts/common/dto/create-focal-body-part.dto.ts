import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { EDifficulty } from "../../../exercise/common/enums";

export class CreateFocalBodyPartDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(EDifficulty)
  difficulty: EDifficulty;
}
