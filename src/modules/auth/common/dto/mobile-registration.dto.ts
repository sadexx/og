import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EPlatformType } from "../../../sessions/common/enums";
import { RegistrationDto } from "./registration.dto";

export class MobileRegistrationDto extends RegistrationDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsEnum(EPlatformType)
  platform: EPlatformType;

  @IsString()
  @IsNotEmpty()
  platformVersion: string;
}
