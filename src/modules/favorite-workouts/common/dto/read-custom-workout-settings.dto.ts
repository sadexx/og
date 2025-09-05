import { Type } from "class-transformer";
import { IsUUID, IsBoolean, IsNumber, IsPositive, ValidateNested, IsNotEmpty } from "class-validator";
import { ReadLowerBodyMovementTypeDto } from "./read-lower-body-movement-type.dto";

export class ReadCustomWorkoutSettingsDto {
  @IsUUID()
  @IsNotEmpty()
  customWorkoutSettingsOnPhoneId: string;

  @IsBoolean()
  @IsNotEmpty()
  isWarmUpStretchingEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isJoggingDrillsStretchingEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isCoolDownStretchingEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isNoEquipmentEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isRainyDayEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isCountdownTimerEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isWildCardEnabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isCircuitBreakEnabled: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  circuitBreakDuration: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReadLowerBodyMovementTypeDto)
  lowerBodyMovementType: string;
}
