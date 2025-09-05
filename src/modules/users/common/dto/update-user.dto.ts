import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength
} from "class-validator";
import { Type } from "class-transformer";
import { EGender, EState, EWeightMeasurementSystem } from "../enums";
import {
  UpdateUserSettingsDto,
  UpdateUserNotificationSettingsDto,
  UpdateUserGripSettingsDto,
  UpdateUserWorkoutSettingsDto
} from "../../../user-additional-entities/common/dto";

const MAX_LENGTH: number = 150;

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH)
  @IsNotEmpty()
  @Matches(/^[A-Za-z- ]+$/, {
    message: "Name must contain only letters and hyphen."
  })
  name?: string;

  @IsOptional()
  @IsEnum(EGender)
  gender?: EGender;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  age?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  weight?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH)
  @IsNotEmpty()
  @Matches(/^[A-Za-z- ]+$/, {
    message: "Name must contain only letters and hyphen."
  })
  locationCity?: string;

  @IsOptional()
  @IsEnum(EState)
  locationState?: EState;

  @IsOptional()
  @IsEnum(EWeightMeasurementSystem)
  weightMeasurementSystem?: EWeightMeasurementSystem;

  @IsOptional()
  @IsBoolean()
  areTermsAccepted?: boolean;

  @IsOptional()
  @IsBoolean()
  isShownInLeaderBoard?: boolean;

  @IsOptional()
  @Type(() => UpdateUserSettingsDto)
  userSettings?: UpdateUserSettingsDto;

  @IsOptional()
  @Type(() => UpdateUserNotificationSettingsDto)
  userNotificationSettings?: UpdateUserNotificationSettingsDto;

  @IsOptional()
  @Type(() => UpdateUserGripSettingsDto)
  userGripSettings?: UpdateUserGripSettingsDto;

  @IsOptional()
  @Type(() => UpdateUserWorkoutSettingsDto)
  userWorkoutSettings?: UpdateUserWorkoutSettingsDto;
}
