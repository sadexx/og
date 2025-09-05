import { IsEnum, IsString, IsNotEmpty, IsNumber, IsUUID, MaxLength, IsPositive, Min } from "class-validator";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";
import { EVideoType } from "../../../video/common/enums";

export class ReadVideoDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEnum(EVideoType)
  @IsNotEmpty()
  type: EVideoType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  subtitle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  url: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ordinalNumber: number;
}
