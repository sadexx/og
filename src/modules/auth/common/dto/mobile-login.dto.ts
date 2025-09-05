import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EPlatformType } from "../../../sessions/common/enums";
import { LoginDto } from "./login.dto";

export class MobileLoginDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsEnum(EPlatformType)
  platform: EPlatformType;

  @IsString()
  @IsNotEmpty()
  platformVersion: string;
}
