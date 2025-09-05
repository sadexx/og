import { IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../../common/dto";

export class GetCoachExercisesByWorkoutDto extends PaginationQueryDto {
  @IsUUID()
  workoutId: string;
}
