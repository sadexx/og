import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { redisClient as connection } from "../../../common/configs/redis.config";
import { Job, Queue, Worker } from "bullmq";
import { logger } from "../../../setup/logger";
import { Settings } from "../../settings/schemas";
import { Workout } from "../../workout/schemas";
import { WorkoutService } from "../../workout/services";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { WorkoutExerciseService } from "../../workout-exercise/services";

export class QueueService {
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;
  private readonly workoutExerciseService = new WorkoutExerciseService();
  private readonly workoutRepository: Repository<Workout>;
  private readonly workoutService = new WorkoutService();
  private readonly calculateWorkoutExerciseQueue: Queue;
  private readonly calculateWorkoutQueue: Queue;
  private readonly workoutExerciseWorker: Worker;
  private readonly workoutWorker: Worker;

  constructor() {
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    this.workoutRepository = AppDataSource.getRepository(Workout);
    this.calculateWorkoutExerciseQueue = new Queue("calculate-workout-exercise", { connection });
    this.calculateWorkoutQueue = new Queue("calculate-workout", { connection });
    this.workoutExerciseWorker = new Worker<{
      workoutExercises: WorkoutExercise[];
      settings: Settings;
    }>(
      "calculate-workout-exercise",
      async (job: Job<{ workoutExercises: WorkoutExercise[]; settings: Settings }>) => this.processWorkoutExercise(job),
      { connection }
    );

    this.workoutWorker = new Worker<{ workouts: Workout[] }>(
      "calculate-workout",
      async (job: Job<{ workouts: Workout[] }>) => this.processWorkout(job),
      { connection }
    );
  }

  public async addWorkoutExerciseJob(data: { workoutExercises: WorkoutExercise[]; settings: Settings }): Promise<void> {
    await this.calculateWorkoutExerciseQueue.add("calculate-workout-exercise", data, {
      removeOnComplete: true,
      removeOnFail: true
    });
  }

  public async addWorkoutJob(data: { workouts: Workout[] }): Promise<void> {
    await this.calculateWorkoutQueue.add("calculate-workout", data, {
      removeOnComplete: true,
      removeOnFail: true
    });
  }

  public async processWorkoutExercise(
    job: Job<{ workoutExercises: WorkoutExercise[]; settings: Settings }>
  ): Promise<void> {
    try {
      const { workoutExercises, settings } = job.data;

      let countWorkoutExercises = 0;

      for (const workoutExercise of workoutExercises) {
        const duration = await this.workoutExerciseService.calculateWorkoutExerciseDuration(
          workoutExercise,
          workoutExercise.primaryExercise,
          settings
        );

        await this.workoutExerciseRepository.update(workoutExercise.id, {
          duration
        });
        countWorkoutExercises++;
        logger.data(
          `Processed Workout-Exercises: ${workoutExercise.id} ${countWorkoutExercises} of ${workoutExercises.length}`
        );
      }
    } catch (error) {
      logger.error("Error processing job:", error);
    }
  }

  public async processWorkout(job: Job<{ workouts: Workout[] }>): Promise<void> {
    try {
      const { workouts } = job.data;
      let countWorkouts = 0;

      for (const workout of workouts) {
        const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);

        await this.workoutRepository.update(workout.id, { duration });

        countWorkouts++;
        logger.data(`Processed Workout: ${workout.id} ${countWorkouts} of ${workouts.length}`);
      }
    } catch (error) {
      logger.error("Error processing job:", error);
    }
  }

  public async onWorkoutExerciseCompleted(listener: (job: Job) => void): Promise<void> {
    this.workoutExerciseWorker.on("completed", listener);
  }

  public async offWorkoutExerciseCompleted(listener: (job: Job) => void): Promise<void> {
    this.workoutExerciseWorker.off("completed", listener);
  }

  public async onWorkoutCompleted(listener: (job: Job) => void): Promise<void> {
    this.workoutWorker.on("completed", listener);
  }

  public async offWorkoutCompleted(listener: (job: Job) => void): Promise<void> {
    this.workoutWorker.off("completed", listener);
  }
}
