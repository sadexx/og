import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { MAX__GROUP_PASSWORD_LENGTH } from "../constants";

export class JoinGroupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX__GROUP_PASSWORD_LENGTH)
  password: string;
}
