import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateIf
} from "class-validator";
import { PaginationQueryDto } from "../../../../common/dto";
import { EDifficulty, EMainBodyPart, EMuscleGroups } from "../enums";
import { Transform } from "class-transformer";

export class FilterExerciseQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9-& ]*$/, {
    message: "Name must contain only letters and hyphen or space."
  })
  search?: string;

  @IsOptional()
  @IsUUID()
  activityTypeId?: string;

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @ValidateIf((object) => object.coachId !== null)
  @IsUUID()
  coachId?: string | null;

  @IsOptional()
  @IsBoolean()
  canBeSecondary?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsEnum(EDifficulty, { each: true })
  difficulties?: EDifficulty[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsEnum(EMainBodyPart, { each: true })
  mainBodyPart?: EMainBodyPart[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsEnum(EMuscleGroups, { each: true })
  muscleGroups?: EMuscleGroups[];
}
