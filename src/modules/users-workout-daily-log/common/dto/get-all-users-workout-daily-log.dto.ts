import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GetAllUsersWorkoutDailyLogDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  workoutOriginalId?: string;
}
