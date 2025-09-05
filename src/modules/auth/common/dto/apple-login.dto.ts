import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EPlatformType } from "../../../sessions/common/enums";

export class AppleLoginDto {
  @IsString()
  @IsNotEmpty()
  appleToken: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsEnum(EPlatformType)
  platform: EPlatformType;

  @IsString()
  @IsNotEmpty()
  platformVersion: string;
}
