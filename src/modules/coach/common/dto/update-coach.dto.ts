import { IsEmail, IsString, MinLength, Matches, MaxLength, IsInt, Min, IsOptional, IsNotEmpty } from "class-validator";
import { PASSWORD_MIN_LENGTH } from "../../../../common/constants";

const MAX_LENGTH = 150;

export class UpdateCoachDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: "Password must be at least 8 characters long"
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least one uppercase letter (A-Z), one number (0-9), and can only include Latin letters, numbers, and special characters @$!%*?&."
  })
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH)
  @Matches(/^[A-Za-z- ]+$/, {
    message: "Name must contain only letters and hyphen."
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  subscriptionPrice?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  coverImageUrl?: string;
}
