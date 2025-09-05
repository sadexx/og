import { GetVerifiedCoachWorkoutsDto } from "./get-verified-coach-workouts.dto";
import { IsIn } from "class-validator";
import { EWorkoutStatus } from "../../../workout/common/enums";
import { UNVERIFIED_WORKOUT_STATUSES } from "../../../workout/common/constants";
import { CommaSeparatedToArray } from "../../../../common/decorators";

export class GetUnverifiedCoachWorkoutsDto extends GetVerifiedCoachWorkoutsDto {
  @CommaSeparatedToArray()
  @IsIn(UNVERIFIED_WORKOUT_STATUSES, { each: true })
  statuses: EWorkoutStatus[];
}
