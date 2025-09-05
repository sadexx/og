import { IsEmail, IsNumber, IsInt, Min, Max } from "class-validator";
import { EMAIL_VERIFICATION_CODE_MIN, EMAIL_VERIFICATION_CODE_MAX } from "../constants";

export class EmailVerifyCodeRecoveryDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsInt()
  @Min(EMAIL_VERIFICATION_CODE_MIN)
  @Max(EMAIL_VERIFICATION_CODE_MAX)
  verificationCode: number;
}
