import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateJustMetricsWorkoutExerciseTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNumber()
  met?: number;

  @IsOptional()
  @IsNumber()
  activityIndex?: number;

  @IsOptional()
  @IsBoolean()
  includeTareValue?: boolean;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  additionalTareValue?: number;

  @IsOptional()
  @IsBoolean()
  isRoundingOfStrainValuesEnabled?: boolean;
}
