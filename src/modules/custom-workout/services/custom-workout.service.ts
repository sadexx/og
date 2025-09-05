import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { CustomWorkoutExercise } from "../schemas";
import { ESortOrder } from "../../../common/enums";

export class CustomWorkoutService {
  private readonly customWorkoutExerciseRepository: Repository<CustomWorkoutExercise>;

  constructor() {
    this.customWorkoutExerciseRepository = AppDataSource.getRepository(CustomWorkoutExercise);
  }

  public async getCustomWorkoutExercisesInCustomWorkout(
    workoutId: string,
    userId: string
  ): Promise<CustomWorkoutExercise[]> {
    const workoutExercises = await this.customWorkoutExerciseRepository.find({
      where: {
        customWorkout: {
          id: workoutId,
          favoriteWorkout: { user: { id: userId } }
        }
      },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return workoutExercises;
  }
}
