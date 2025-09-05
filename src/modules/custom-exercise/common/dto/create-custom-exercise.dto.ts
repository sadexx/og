import { Type } from "class-transformer";
import {
  IsOptional,
  IsUUID,
  ValidateNested,
  IsString,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
  IsNumber,
  IsPositive,
  IsEnum,
  IsBoolean,
  ArrayNotEmpty,
  IsEmpty
} from "class-validator";
import { MAX_CHARACTERS_LENGTH } from "../../../../common/constants";
import { EEffortLevel, EQuantityUnit, EMainBodyPart, EDifficulty, EMuscleGroups } from "../../../exercise/common/enums";
import { ReadVideoDto, ReadActivityTypeDto, ReadEquipmentsDto } from "../../../favorite-workouts/common/dto";

export class CreateCustomExerciseDto {
  @IsUUID()
  @IsNotEmpty()
  customExerciseOnPhoneId: string;

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
  @IsNotEmpty()
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

  @IsEmpty()
  titleAudio: null;

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

  @IsEmpty()
  manualAudio: null;

  @IsNotEmpty()
  manualTitles: string[];

  @IsNotEmpty()
  manualDescriptions: string[];

  @IsOptional()
  @ValidateIf((i) => i.easierExerciseId !== null)
  @IsUUID()
  easierExerciseId: string | null;

  @IsOptional()
  @ValidateIf((i) => i.harderExerciseId !== null)
  @IsUUID()
  harderExerciseId: string | null;
}
