import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { QueueService } from "../../queue/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { UpdateSettingsDto } from "../common/dto";
import { ECompleteWorkoutWithPauseAfter } from "../common/enums";
import { Settings } from "../schemas";
import { Workout } from "../../workout/schemas";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { ESortOrder } from "../../../common/enums";

export class SettingsService {
  private readonly settingsRepository: Repository<Settings>;
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;
  private readonly workoutRepository: Repository<Workout>;

  constructor(
    private readonly queueService = new QueueService(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.settingsRepository = AppDataSource.getRepository(Settings);
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    this.workoutRepository = AppDataSource.getRepository(Workout);
  }

  public async getSettings(): Promise<Omit<Settings, "id">> {
    let settings = await this.settingsRepository.find();

    if (settings.length === 0) {
      const defaultSettings: Partial<Settings> = {
        restDurationForLowEffortLevelExercise: 10,
        restDurationForMediumEffortLevelExercise: 25,
        restDurationForHighEffortLevelExercise: 20,
        restDurationForVigorousEffortLevelExercise: 25,
        quantityForLowEnduranceLevelWorkout: 10,
        quantityForMediumEnduranceLevelWorkout: 15,
        quantityForHighEnduranceLevelWorkout: 20,
        metForLowEffortLevelExercise: 3.5,
        metForMediumEffortLevelExercise: 5.5,
        metForHighEffortLevelExercise: 8.0,
        metForVigorousEffortLevelExercise: 9.0,
        circuitBreakDuration: 2,
        completeWorkoutWithPauseAfter: ECompleteWorkoutWithPauseAfter.NEVER,
        rightGripAdjustmentCoefficient: 1,
        leftGripAdjustmentCoefficient: 1
      };

      await this.settingsRepository.save(defaultSettings);
      settings = await this.settingsRepository.find();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...settingsWithoutId } = settings[0];

    return settingsWithoutId;
  }

  public async update(dto: UpdateSettingsDto): Promise<Settings> {
    const [settings] = await this.settingsRepository.find();

    if (!settings) {
      throw new NotFoundException("Settings not found");
    }

    const updatedSettings = this.settingsRepository.merge(settings, dto);
    await this.settingsRepository.save(updatedSettings);

    if (
      dto.restDurationForLowEffortLevelExercise ||
      dto.restDurationForMediumEffortLevelExercise ||
      dto.restDurationForHighEffortLevelExercise ||
      dto.restDurationForVigorousEffortLevelExercise
    ) {
      /**
       ** Recalculate WorkoutExercise duration
       */
      const [settings] = await this.settingsRepository.find();
      const workoutExercises = await this.workoutExerciseRepository.find({
        relations: { primaryExercise: true, secondaryExercise: true }
      });

      await this.queueService.addWorkoutExerciseJob({
        workoutExercises,
        settings
      });

      /**
       ** Recalculate Workout duration
       */

      const onCompleted = async (): Promise<void> => {
        const workouts = await this.workoutRepository.find({
          relations: {
            exerciseOrder: {
              primaryExercise: {
                equipments: true
              },
              secondaryExercise: {
                equipments: true
              }
            }
          },
          order: { exerciseOrder: { ordinalNumber: ESortOrder.ASC } }
        });

        await this.queueService.addWorkoutJob({
          workouts
        });
        this.queueService.offWorkoutExerciseCompleted(onCompleted);
      };

      this.queueService.onWorkoutExerciseCompleted(onCompleted);
    }

    await this.batchEntityFetcherService.updateCache();

    return updatedSettings;
  }
}
