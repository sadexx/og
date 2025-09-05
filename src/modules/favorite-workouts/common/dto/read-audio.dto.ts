import { IsUUID, IsString, IsNotEmpty, MaxLength } from "class-validator";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";

const MAX_TEXT_LENGTH: number = 2000;

export class ReadAudioDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_TEXT_LENGTH)
  text: string;
}
