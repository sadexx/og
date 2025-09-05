import { IsEnum } from "class-validator";
import { EWorkoutStatus } from "../../../workout/common/enums";

export class CoachWorkoutManualDecisionDto {
  @IsEnum(EWorkoutStatus)
  status: EWorkoutStatus;
}
