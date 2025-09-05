import { IsInt, IsNumber, Max, Min } from "class-validator";
import { EMAIL_VERIFICATION_CODE_MAX, EMAIL_VERIFICATION_CODE_MIN } from "../constants";

export class EmailVerifyCodeDto {
  @IsNumber()
  @IsInt()
  @Min(EMAIL_VERIFICATION_CODE_MIN)
  @Max(EMAIL_VERIFICATION_CODE_MAX)
  verificationCode: number;
}
