import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateGripFirmwareDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  version?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  versionName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fileUrl?: string;
}
