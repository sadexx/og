import { IsEnum, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ReadRollingPlanWorkoutDto } from "./read-rolling-plan-workout.dto";
import { ERollingPlanCycleType } from "../enums";

export class ReadRollingPlanCycleDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReadRollingPlanWorkoutDto)
  rollingPlanWorkouts: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ordinalNumber: number;

  @IsEnum(ERollingPlanCycleType)
  @IsNotEmpty()
  type: ERollingPlanCycleType;
}
