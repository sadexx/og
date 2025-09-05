import { IsNumber, IsNotEmpty, IsPositive, IsUUID } from "class-validator";

export class ReadRollingPlanWorkoutDto {
  @IsUUID()
  @IsNotEmpty()
  favoriteWorkoutId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ordinalNumber: number;
}
