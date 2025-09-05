import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { MAX__GROUP_PASSWORD_LENGTH } from "../constants";

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX__GROUP_PASSWORD_LENGTH)
  password: string;
}
