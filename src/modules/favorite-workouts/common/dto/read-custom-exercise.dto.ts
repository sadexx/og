import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  ArrayNotEmpty,
  ValidateNested,
  MaxLength,
  IsPositive,
  ValidateIf
} from "class-validator";
import { Type } from "class-transformer";
import { EEffortLevel, EQuantityUnit, EMainBodyPart, EDifficulty, EMuscleGroups } from "../../../exercise/common/enums";
import { ReadActivityTypeDto } from "./read-activity-type.dto";
import { ReadAudioDto } from "./read-audio.dto";
import { ReadEquipmentsDto } from "./read-equipments.dto";
import { ReadVideoDto } from "./read-video.dto";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";

export class ReadCustomExerciseDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsUUID()
  customExerciseOnPhoneId?: string | null;

  @IsOptional()
  @IsUUID()
  rainyDayExerciseId?: string;

  @IsOptional()
  @IsUUID()
  noEquipmentExerciseId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadVideoDto)
  preparationGuideVideo?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadVideoDto)
  generalSafetyVideo?: string;

  @ValidateNested()
  @Type(() => ReadActivityTypeDto)
  activityType: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReadEquipmentsDto)
  equipments?: string[] | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  title: string;

  @IsOptional()
  @ValidateIf((i) => i.aka !== null)
  @IsString()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  aka: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  met: number;

  @IsEnum(EEffortLevel)
  @IsNotEmpty()
  effortLevel: EEffortLevel;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  secsPerQuantityUnit: number;

  @IsEnum(EQuantityUnit)
  @IsNotEmpty()
  quantityUnit: EQuantityUnit;

  @IsBoolean()
  rightLeftSeparately: boolean;

  @IsBoolean()
  canContainSecondary: boolean;

  @IsBoolean()
  canBeSecondary: boolean;

  @IsEnum(EMainBodyPart)
  @IsNotEmpty()
  mainBodyPart: EMainBodyPart;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  imageUrl: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadAudioDto)
  titleAudio: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CHARACTERS_LENGTH)
  videoUrl?: string;

  @IsEnum(EDifficulty)
  @IsNotEmpty()
  difficulty: EDifficulty;

  @ArrayNotEmpty()
  @IsEnum(EMuscleGroups, { each: true })
  muscleGroups: EMuscleGroups[];

  @IsBoolean()
  @IsNotEmpty()
  isOnlyOneGripRequired: boolean;

  @IsOptional()
  @ValidateIf((e) => e.manualAudio !== null)
  @ValidateNested()
  @Type(() => ReadAudioDto)
  manualAudio: string | null;

  @IsNotEmpty()
  manualTitles: string[];

  @IsNotEmpty()
  manualDescriptions: string[];

  @IsOptional()
  @ValidateIf((e) => e.easierExerciseId !== null)
  @IsUUID()
  easierExerciseId: string | null;

  @IsOptional()
  @ValidateIf((e) => e.harderExerciseId !== null)
  @IsUUID()
  harderExerciseId: string | null;
}
