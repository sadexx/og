import { Type } from "class-transformer";
import { IsUUID, IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested, MaxLength, Min } from "class-validator";
import { ReadAudioDto } from "./read-audio.dto";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";

export class ReadEquipmentsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  keyTitle?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  setupDuration: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  removalDuration: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  adjustmentDuration: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  priority: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  setupVideoUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  adjustmentVideoUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  removalVideoUrl?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  setupAudioText: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  adjustmentAudioText: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  removalAudioText: string;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  titleAudio: string;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  setupAudio: string;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  adjustmentAudio: string;

  @ValidateNested()
  @Type(() => ReadAudioDto)
  removalAudio: string;
}
