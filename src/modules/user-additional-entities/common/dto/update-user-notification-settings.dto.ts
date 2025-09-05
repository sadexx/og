import { IsOptional, IsBoolean, IsNumber } from "class-validator";

export class UpdateUserNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  isWorkoutReminderEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  targetWorkoutsPerWeek?: number;
}
