import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { PASSWORD_MIN_LENGTH } from "../../../../common/constants";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
