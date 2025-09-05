import { IsString, IsNotEmpty } from "class-validator";

export class CreateDefaultAudioDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
