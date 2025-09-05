import { IsString, IsNumber, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateJustMetricsWorkoutExerciseTypeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  met: number;

  @IsNumber()
  activityIndex: number;

  @IsBoolean()
  includeTareValue: boolean;

  @IsNumber()
  @IsNotEmpty()
  additionalTareValue: number;

  @IsBoolean()
  isRoundingOfStrainValuesEnabled: boolean;
}
