import { IsBoolean, IsOptional } from "class-validator";

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  isAudioTrainerEnabled?: boolean;
}
