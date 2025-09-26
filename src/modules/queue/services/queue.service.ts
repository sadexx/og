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
import { Message } from "@aws-sdk/client-sqs";
import {
  NUMBER_OF_MILLISECONDS_IN_MINUTE,
  NUMBER_OF_MILLISECONDS_IN_SECOND,
  NUMBER_OF_MINUTES_IN_FIFTEEN_DAYS,
  NUMBER_OF_SECONDS_IN_MINUTE
} from "../../../common/constants";
import { AppStoreProductTransactionService } from "../../app-store-product/services";
import { IAppStoreWebhookData } from "../../app-store-product/common/interfaces";

export class QueueService {
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;
  private readonly workoutExerciseService = new WorkoutExerciseService();
  private readonly workoutRepository: Repository<Workout>;
  private readonly workoutService = new WorkoutService();
  private readonly calculateWorkoutExerciseQueue: Queue;
  private readonly calculateWorkoutQueue: Queue;
  private readonly processAppleWebhookQueue: Queue;
  private readonly workoutExerciseWorker: Worker;
  private readonly workoutWorker: Worker;
  private readonly processAppleWebhookWorker: Worker;

  constructor(private readonly appStoreTransactionService = new AppStoreProductTransactionService()) {
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    this.workoutRepository = AppDataSource.getRepository(Workout);
    this.calculateWorkoutExerciseQueue = new Queue("calculate-workout-exercise", { connection });
    this.calculateWorkoutQueue = new Queue("calculate-workout", { connection });
    this.processAppleWebhookQueue = new Queue("process-apple-webhook", { connection });
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

    this.processAppleWebhookWorker = new Worker<{ sqsMessages: Message[] }>(
      "process-apple-webhook",
      async (job: Job<{ sqsMessages: Message[] }>) => this.processAppleWebhook(job),
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

  public async addProcessAppleWebhookJob(data: { sqsMessages: Message[] }): Promise<void> {
    await this.processAppleWebhookQueue.add("process-apple-webhook", data, {
      delay: NUMBER_OF_MILLISECONDS_IN_SECOND,
      backoff: {
        type: "exponential",
        delay: NUMBER_OF_MILLISECONDS_IN_MINUTE
      },
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: { age: NUMBER_OF_MINUTES_IN_FIFTEEN_DAYS * NUMBER_OF_SECONDS_IN_MINUTE, count: 200 }
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

  public async processAppleWebhook(job: Job<{ sqsMessages: Message[] }>): Promise<void> {
    try {
      const { sqsMessages } = job.data;

      for (const message of sqsMessages) {
        if (!message.Body) {
          logger.warn(`Apple webhook message without body: ${message.MessageId}`);
          continue;
        }

        const webhookData = JSON.parse(message.Body) as IAppStoreWebhookData;
        await this.appStoreTransactionService.processAppStoreWebhookProductTransaction(webhookData);
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

  public async onProcessAppleWebhookCompleted(listener: (job: Job) => void): Promise<void> {
    this.processAppleWebhookWorker.on("completed", listener);
  }

  public async offProcessAppleWebhookCompleted(listener: (job: Job) => void): Promise<void> {
    this.processAppleWebhookWorker.off("completed", listener);
  }
}
