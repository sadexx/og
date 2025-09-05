import { IsNumber, IsInt, Min, Max, IsString, MinLength, Matches, IsEmail } from "class-validator";
import { EMAIL_VERIFICATION_CODE_MIN, EMAIL_VERIFICATION_CODE_MAX } from "../constants";
import { PASSWORD_MIN_LENGTH } from "../../../../common/constants";

export class EmailAccountRecoveryDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsInt()
  @Min(EMAIL_VERIFICATION_CODE_MIN)
  @Max(EMAIL_VERIFICATION_CODE_MAX)
  verificationCode: number;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: "Password must be at least 8 characters long"
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least one uppercase letter (A-Z), one number (0-9), and can only include Latin letters, numbers, and special characters @$!%*?&."
  })
  newPassword: string;
}
