import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsUUID,
  MaxLength,
  IsPositive,
  Min,
  IsOptional
} from "class-validator";
import { ReadAudioDto } from "./read-audio.dto";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";

export class ReadActivityTypeDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  shortTitle: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  abbreviation: string;

  @IsBoolean()
  includeTareValue: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  activityIndex: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  additionalTareValue: number;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  titleAudio: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadAudioDto)
  shortTitleAudio: string | null;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  abbreviationAudio: string;
}
