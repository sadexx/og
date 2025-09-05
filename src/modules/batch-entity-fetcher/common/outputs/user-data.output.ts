import { CustomExercise } from "../../../custom-exercise/schemas";
import { CustomStretching } from "../../../custom-stretching/schemas/custom-stretching.entity";
import { FavoriteWorkout } from "../../../favorite-workouts/schemas";
import { RollingPlan } from "../../../rolling-plan/schemas";

export class UserDataOutput {
  rollingPlan: RollingPlan | null;
  favoriteWorkouts: FavoriteWorkout[];
  customExercises: CustomExercise[];
  customStretches: CustomStretching[];
}
