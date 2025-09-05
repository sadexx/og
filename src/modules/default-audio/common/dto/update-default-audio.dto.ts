import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDefaultAudioDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  key?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}
