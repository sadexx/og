import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { MAX__GROUP_PASSWORD_LENGTH } from "../constants";

export class UpdateGroupDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX__GROUP_PASSWORD_LENGTH)
  password?: string;
}
