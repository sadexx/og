/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { logger } from "../../../setup/logger";
import { CreateWorkoutExerciseDto, UpdateWorkoutExerciseDto } from "../common/dto";
import { NotFoundException } from "../../../common/exceptions";
import { Exercise } from "../../exercise/schemas";
import { Settings } from "../../settings/schemas";
import { Workout } from "../../workout/schemas";
import { WorkoutService } from "../../workout/services";
import { WorkoutExercise } from "../schemas";
import { getNextOrdinalNumber } from "../../../common/helpers";

export class WorkoutExerciseService {
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;
  private readonly settingsRepository: Repository<Settings>;
  private readonly exerciseRepository: Repository<Exercise>;
  private readonly workoutRepository: Repository<Workout>;

  private findWorkoutQuery(workoutId: string[]): SelectQueryBuilder<Workout> {
    return this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoinAndSelect("workout.exerciseOrder", "exerciseOrder")
      .leftJoinAndSelect("exerciseOrder.primaryExercise", "primaryExercise")
      .leftJoinAndSelect("primaryExercise.equipments", "primaryEquipments")
      .leftJoinAndSelect("exerciseOrder.secondaryExercise", "secondaryExercise")
      .leftJoinAndSelect("secondaryExercise.equipments", "secondaryEquipments")
      .where("workout.id IN (:...ids)", { ids: workoutId })
      .orderBy("exerciseOrder.ordinalNumber", "ASC");
  }

  private readonly relations = {
    primaryExercise: {
      preparationGuideVideo: true,
      generalSafetyVideo: true,
      activityType: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true
      },
      equipments: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      },
      titleAudio: true
    },
    secondaryExercise: {
      preparationGuideVideo: true,
      generalSafetyVideo: true,
      activityType: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true
      },
      equipments: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      },
      titleAudio: true,
      manualAudio: true
    }
  };

  private readonly DEFAULT_EFFORT_LEVEL_REST = {
    LOW: 10,
    MEDIUM: 15,
    HIGH: 20,
    VIGOROUS: 25
  };

  constructor(private readonly workoutService = new WorkoutService()) {
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    this.settingsRepository = AppDataSource.getRepository(Settings);
    this.exerciseRepository = AppDataSource.getRepository(Exercise);
    this.workoutRepository = AppDataSource.getRepository(Workout);
  }

  public async getById(id: string): Promise<WorkoutExercise | null> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: this.relations
    });

    if (!workoutExercise) {
      throw new NotFoundException("Workout-exercise not found");
    }

    return workoutExercise;
  }

  public async create(dto: CreateWorkoutExerciseDto): Promise<WorkoutExercise> {
    const workout = await this.findWorkoutQuery([dto.workoutId]).getOne();

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    const primaryExercise = await this.exerciseRepository.findOne({
      where: { id: String(dto.primaryExerciseId) },
      relations: { equipments: true }
    });

    if (!primaryExercise) {
      throw new NotFoundException("Primary-exercise not found");
    }

    const workoutExercise = this.workoutExerciseRepository.create({
      ...dto,
      primaryExercise: dto.primaryExerciseId,
      secondaryExercise: dto.secondaryExerciseId
    });
    workoutExercise.ordinalNumber = getNextOrdinalNumber(workout.exerciseOrder);

    const [settings] = await this.settingsRepository.find();
    workoutExercise.duration = await this.calculateWorkoutExerciseDuration(workoutExercise, primaryExercise, settings);

    await this.workoutExerciseRepository.save(workoutExercise);

    workoutExercise.primaryExercise = primaryExercise;
    workout.exerciseOrder = [...workout.exerciseOrder, workoutExercise];

    workout.duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);

    await this.workoutRepository.save(workout);

    const responseWorkoutExercise = {
      ...workoutExercise,
      primaryExercise: primaryExercise.id
    } as unknown as WorkoutExercise;

    return responseWorkoutExercise;
  }

  public async update(id: string, dto: UpdateWorkoutExerciseDto): Promise<WorkoutExercise> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: { primaryExercise: true, workout: true }
    });

    if (!workoutExercise) {
      throw new NotFoundException("Workout-exercise not found");
    }

    if (dto?.primaryExerciseId) {
      workoutExercise.primaryExercise = await this.exerciseRepository.findOne({
        where: { id: String(dto.primaryExerciseId) }
      });
    }

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      primaryExerciseId,
      secondaryExerciseId: secondaryExercise,
      ...restDto
    } = dto;

    const updatedWorkoutExercise = this.workoutExerciseRepository.merge(workoutExercise, {
      ...restDto,
      secondaryExercise
    });

    const [settings] = await this.settingsRepository.find();
    updatedWorkoutExercise.duration = await this.calculateWorkoutExerciseDuration(
      updatedWorkoutExercise,
      workoutExercise.primaryExercise,
      settings
    );

    await this.workoutExerciseRepository.save(updatedWorkoutExercise);

    if (updatedWorkoutExercise.workout.length > 0) {
      const workoutId = updatedWorkoutExercise.workout.map((workout) => workout.id);
      const workout = await this.findWorkoutQuery(workoutId).getOne();

      if (!workout) {
        throw new NotFoundException("Workout not found");
      }

      const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);
      await this.workoutRepository.update(workout.id, { duration });
    }

    return updatedWorkoutExercise;
  }

  public async delete(id: string): Promise<void> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: { workout: true }
    });

    if (!workoutExercise) {
      throw new NotFoundException("Workout-exercise not found");
    }

    const workoutId = workoutExercise.workout.map((workout) => workout.id);
    await this.workoutExerciseRepository.remove(workoutExercise);
    const workout = await this.findWorkoutQuery(workoutId).getOne();

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);
    await this.workoutRepository.update(workout.id, { duration });
  }

  public async handlePrimaryExerciseDeletion(primaryExerciseIds: string[]): Promise<void> {
    await this.workoutExerciseRepository.update(
      { id: In(primaryExerciseIds) },
      { primaryExercise: null, secondaryExercise: null, duration: 0 }
    );

    const workoutExercise: WorkoutExercise[] = await this.workoutExerciseRepository.find({
      where: { id: In(primaryExerciseIds) },
      relations: { workout: true }
    });

    if (!workoutExercise) {
      throw new NotFoundException("Workout-exercise not found");
    }

    const workoutIds: string[] = workoutExercise.flatMap((workoutExercise) =>
      workoutExercise.workout.map((workout) => workout.id)
    );
    const workouts = await this.findWorkoutQuery(workoutIds).getMany();

    for (const workout of workouts) {
      const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);
      await this.workoutRepository.update(workout.id, {
        duration
      });
    }
  }

  public async calculateWorkoutExerciseDuration(
    workoutExercise: WorkoutExercise,
    primaryExercise: Exercise | null,
    settings: Settings
  ): Promise<number> {
    const RIGHT_LEFT_MULTIPLIER = 2;

    if (!primaryExercise) {
      return 0;
    }

    const EffortLevelNumber = {
      LOW: settings.restDurationForLowEffortLevelExercise ?? this.DEFAULT_EFFORT_LEVEL_REST.LOW,
      MEDIUM: settings.restDurationForMediumEffortLevelExercise ?? this.DEFAULT_EFFORT_LEVEL_REST.MEDIUM,
      HIGH: settings.restDurationForHighEffortLevelExercise ?? this.DEFAULT_EFFORT_LEVEL_REST.HIGH,
      VIGOROUS: settings.restDurationForVigorousEffortLevelExercise ?? this.DEFAULT_EFFORT_LEVEL_REST.VIGOROUS
    };

    const rightLeftSeparatelyMultiplier = (primaryExercise.rightLeftSeparately as boolean) ? RIGHT_LEFT_MULTIPLIER : 1;

    const restTime = EffortLevelNumber[primaryExercise!.effortLevel];

    const duration =
      (Number(primaryExercise!.secsPerQuantityUnit) * Number(workoutExercise.quantity) + Number(restTime)) *
      Number(rightLeftSeparatelyMultiplier) *
      Number(workoutExercise.sets);
    logger.data(
      `Total Formula : (${primaryExercise!.secsPerQuantityUnit} * ${
        workoutExercise.quantity
      } + ${restTime}) * ${rightLeftSeparatelyMultiplier} * ${
        workoutExercise.sets
      } = ${duration.toFixed(RIGHT_LEFT_MULTIPLIER)}`
    );

    return Number(duration.toFixed(RIGHT_LEFT_MULTIPLIER));
  }
}
