import { IsOptional, IsString } from "class-validator";

export class UpdateUserGripSettingsDto {
  @IsOptional()
  @IsString()
  gripTypeId?: string;
}
