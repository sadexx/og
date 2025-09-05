import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsUUID,
  ArrayUnique,
  ArrayNotEmpty,
  ValidateIf
} from "class-validator";
import { ActivityType } from "../../../activity-type/schemas";
import { Equipments } from "../../../equipments/schemas";
import { EDifficulty, EEffortLevel, EMainBodyPart, EMuscleGroups, EQuantityUnit } from "../enums";
import { Video } from "../../../video/schemas";

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rainyDayExerciseId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  noEquipmentExerciseId?: string;

  @IsOptional()
  @IsUUID()
  preparationGuideVideoId?: Video;

  @IsOptional()
  @IsUUID()
  generalSafetyVideoId?: Video;

  @IsOptional()
  @IsUUID()
  activityTypeId?: ActivityType;

  @IsOptional()
  @ArrayUnique()
  equipmentIds?: Equipments[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  aka?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  met?: number;

  @IsOptional()
  @IsEnum(EEffortLevel)
  effortLevel?: EEffortLevel;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  secsPerQuantityUnit?: number;

  @IsOptional()
  @IsEnum(EQuantityUnit)
  quantityUnit?: EQuantityUnit;

  @IsOptional()
  @IsBoolean()
  rightLeftSeparately?: boolean;

  @IsOptional()
  @IsBoolean()
  canContainSecondary?: boolean;

  @IsOptional()
  @IsBoolean()
  canBeSecondary?: boolean;

  @IsOptional()
  @IsEnum(EMainBodyPart)
  mainBodyPart?: EMainBodyPart;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  videoUrl?: string;

  @IsOptional()
  @IsEnum(EDifficulty)
  difficulty?: EDifficulty;

  @IsOptional()
  @ArrayNotEmpty()
  @IsEnum(EMuscleGroups, { each: true })
  muscleGroups?: EMuscleGroups[];

  @IsOptional()
  @IsBoolean()
  isOnlyOneGripRequired?: boolean;

  @IsOptional()
  @ValidateIf((e) => e.manualTitles && e.manualTitles.length > 0)
  @IsString({ each: true })
  @ArrayNotEmpty()
  manualTitles?: string[];

  @IsOptional()
  @ValidateIf((e) => e.manualDescriptions && e.manualDescriptions.length > 0)
  @IsString({ each: true })
  @ArrayNotEmpty()
  manualDescriptions?: string[];

  @IsOptional()
  @IsUUID()
  easierExerciseId?: string;

  @IsOptional()
  @IsUUID()
  harderExerciseId?: string;

  @IsOptional()
  @IsUUID()
  coachId?: string;
}
