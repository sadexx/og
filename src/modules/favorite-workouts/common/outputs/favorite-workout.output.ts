export class FavoriteWorkoutOutput {
  id: string;
  customFavoriteWorkoutOnPhoneId: string;
  workout?: { id: string } | null;
  customWorkout?: { id: string } | null;
  customWorkoutSettings?: { id: string } | null;
  createdDate: Date;
  updatedDate: Date;
}
