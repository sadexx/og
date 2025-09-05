import { IsString, MinLength, Matches, ValidateIf } from "class-validator";
import { PASSWORD_MIN_LENGTH } from "../../../../common/constants";

export class UpdateUserPasswordDto {
  @ValidateIf((o: UpdateUserPasswordDto) => o.oldPassword !== "")
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: "Password must be at least 8 characters long"
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least one uppercase letter (A-Z), one number (0-9), and can only include Latin letters, numbers, and special characters @$!%*?&."
  })
  oldPassword: string;

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
