import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from "class-validator";
import { ActivityType } from "../../../activity-type/schemas";
import { Equipments } from "../../../equipments/schemas";
import { EEffortLevel, EQuantityUnit, EMainBodyPart, EDifficulty, EMuscleGroups } from "../enums";
import { Video } from "../../../video/schemas";

export class CreateExerciseDto {
  @IsOptional()
  @IsUUID()
  rainyDayExerciseId?: string;

  @IsOptional()
  @IsUUID()
  noEquipmentExerciseId?: string;

  @IsOptional()
  @IsUUID()
  preparationGuideVideoId?: Video;

  @IsOptional()
  @IsUUID()
  generalSafetyVideoId?: Video;

  @IsUUID()
  activityTypeId: ActivityType;

  @IsOptional()
  @ArrayUnique()
  equipmentIds: Equipments[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  aka: string;

  @IsNumber()
  @IsNotEmpty()
  met: number;

  @IsEnum(EEffortLevel)
  effortLevel: EEffortLevel;

  @IsNumber()
  @IsNotEmpty()
  secsPerQuantityUnit: number;

  @IsEnum(EQuantityUnit)
  quantityUnit: EQuantityUnit;

  @IsBoolean()
  rightLeftSeparately: boolean;

  @IsBoolean()
  canContainSecondary: boolean;

  @IsBoolean()
  canBeSecondary: boolean;

  @IsEnum(EMainBodyPart)
  mainBodyPart: EMainBodyPart;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @IsEnum(EDifficulty)
  difficulty: EDifficulty;

  @ArrayNotEmpty()
  @IsEnum(EMuscleGroups, { each: true })
  muscleGroups: EMuscleGroups[];

  @IsBoolean()
  @IsNotEmpty()
  isOnlyOneGripRequired: boolean;

  @IsOptional()
  @IsString({ each: true })
  @ArrayNotEmpty()
  manualTitles?: string[];

  @IsOptional()
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
