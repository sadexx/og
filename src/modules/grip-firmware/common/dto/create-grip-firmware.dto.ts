import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { GripType } from "../../../grip-types/schemas";

export class CreateGripFirmwareDto {
  @IsUUID()
  gripTypeId: GripType;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsString()
  versionName: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;
}
