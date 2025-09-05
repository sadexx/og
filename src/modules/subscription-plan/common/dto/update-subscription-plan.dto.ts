import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

export class UpdateSubscriptionPlanDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  liveWorkout?: boolean;

  @IsOptional()
  @IsBoolean()
  workoutLibrary?: boolean;

  @IsOptional()
  @IsBoolean()
  stretches?: boolean;

  @IsOptional()
  @IsBoolean()
  intervalLog?: boolean;

  @IsOptional()
  @IsBoolean()
  tutorialVideos?: boolean;

  @IsOptional()
  @IsBoolean()
  globalStats?: boolean;

  @IsOptional()
  @IsBoolean()
  dailyReports?: boolean;

  @IsOptional()
  @IsBoolean()
  progressGraph?: boolean;

  @IsOptional()
  @IsBoolean()
  leaderboard?: boolean;

  @IsOptional()
  @IsBoolean()
  rollingPlan?: boolean;

  @IsOptional()
  @IsBoolean()
  customWorkouts?: boolean;

  @IsOptional()
  @IsBoolean()
  customStretches?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  coins?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  fitnessGroupSlots?: number;
}
