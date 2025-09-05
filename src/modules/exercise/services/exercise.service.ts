import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Not,
  Raw,
  Repository
} from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Audio } from "../../audio/schemas";
import { logger } from "../../../setup/logger";
import {
  CreateExerciseDto,
  ExercisesIdsDto,
  FilterExerciseQueryDto,
  GetWildCardExerciseQueryDto,
  UpdateExerciseDto
} from "../common/dto";
import { NotFoundException } from "../../../common/exceptions";
import { getRandomElement, validateEntitiesExistence } from "../../../common/helpers";
import { AwsS3Service } from "../../aws-s3/services";
import { AudioService } from "../../audio/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { Equipments } from "../../equipments/schemas";
import { EDifficulty } from "../common/enums";
import { Exercise } from "../schemas";
import { Settings } from "../../settings/schemas";
import { Workout } from "../../workout/schemas";
import { WorkoutService } from "../../workout/services";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { WorkoutExerciseService } from "../../workout-exercise/services";
import { PaginationQueryOutput } from "../../../common/outputs";
import { ESortOrder } from "../../../common/enums";

export class ExerciseService {
  private readonly exerciseRepository: Repository<Exercise>;
  private readonly equipmentsRepository: Repository<Equipments>;
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;
  private readonly workoutRepository: Repository<Workout>;
  private readonly settingsRepository: Repository<Settings>;

  private readonly select: FindOptionsSelect<Exercise> = {
    coach: {
      id: true,
      description: true,
      coverImageUrl: true,
      user: {
        id: true,
        name: true,
        email: true
      }
    }
  };

  private readonly relations: FindOptionsRelations<Exercise> = {
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
    manualAudio: true,
    coach: { user: true }
  };

  constructor(
    private readonly audioService = new AudioService(),
    private readonly workoutExerciseService = new WorkoutExerciseService(),
    private readonly workoutService = new WorkoutService(),
    private readonly awsS3Service = new AwsS3Service(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.exerciseRepository = AppDataSource.getRepository(Exercise);
    this.equipmentsRepository = AppDataSource.getRepository(Equipments);
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    this.workoutRepository = AppDataSource.getRepository(Workout);
    this.settingsRepository = AppDataSource.getRepository(Settings);
  }

  public async getAll(dto: FilterExerciseQueryDto): Promise<PaginationQueryOutput<Exercise>> {
    const whereConditions: FindOptionsWhere<Exercise> = {};

    if (dto.search) {
      whereConditions.title = ILike(`%${dto.search}%`);
    }

    if (dto.activityTypeId) {
      whereConditions.activityType = { id: dto.activityTypeId };
    }

    if (dto.canBeSecondary !== undefined) {
      whereConditions.canBeSecondary = dto.canBeSecondary;
    }

    if (dto.mainBodyPart && dto.mainBodyPart.length > 0) {
      whereConditions.mainBodyPart = In(dto.mainBodyPart);
    }

    if (dto.difficulties && dto.difficulties.length > 0) {
      whereConditions.difficulty = In(dto.difficulties);
    }

    if (dto.muscleGroups && dto.muscleGroups.length > 0) {
      whereConditions.muscleGroups = Raw((alias) => `${alias} @> :muscleGroups`, {
        muscleGroups: dto.muscleGroups
      });
    }

    if (dto.coachId !== undefined) {
      whereConditions.coach = dto.coachId === null ? IsNull() : { id: dto.coachId };
    }

    const [exercises, total] = await this.exerciseRepository.findAndCount({
      select: this.select,
      where: whereConditions,
      relations: this.relations,
      order: {
        title: ESortOrder.ASC
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: exercises,
      pageNumber: dto.page,
      pageCount: totalPages
    };
  }

  public async getById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      select: this.select,
      where: { id },
      relations: this.relations
    });

    if (!exercise) {
      throw new NotFoundException("Exercise not found");
    }

    return exercise;
  }

  public async getWildCard(dto: GetWildCardExerciseQueryDto): Promise<Exercise | null> {
    const exercises = await this.exerciseRepository.find({
      select: this.select,
      where: {
        id: Not(In(dto.excludeIds)),
        activityType: { id: dto.activityTypeId },
        difficulty: dto.difficulty as EDifficulty
      },
      relations: this.relations
    });

    const randomExercise = getRandomElement(exercises);

    return randomExercise;
  }

  public async create(dto: CreateExerciseDto): Promise<Exercise> {
    const {
      equipmentIds: equipmentArrayIds,
      title: titleText,
      manualTitles: manualTitlesArray,
      manualDescriptions: manualDescriptionsArray,
      ...exerciseData
    } = dto;

    const audioTitle: Audio = await this.audioService.create(titleText, "exercises/audio");

    let audioManual: Audio | null = null;

    if (
      manualTitlesArray &&
      manualTitlesArray.length > 0 &&
      manualDescriptionsArray &&
      manualDescriptionsArray.length > 0
    ) {
      const combinedManual = await this.combineManualTitlesAndDescriptions(manualTitlesArray, manualDescriptionsArray);

      audioManual = await this.audioService.create(combinedManual, "exercises/audio");
    }

    const equipmentIds: Equipments[] | null = equipmentArrayIds
      ? await validateEntitiesExistence<Equipments>(equipmentArrayIds, this.equipmentsRepository)
      : null;

    const exercise = this.exerciseRepository.create({
      preparationGuideVideo: exerciseData.preparationGuideVideoId,
      generalSafetyVideo: exerciseData.generalSafetyVideoId,
      activityType: exerciseData.activityTypeId,
      equipments: equipmentIds,
      titleAudio: audioTitle,
      title: titleText,
      manualAudio: audioManual,
      manualTitles: manualTitlesArray,
      manualDescriptions: manualDescriptionsArray,
      coach: { id: exerciseData.coachId },
      ...exerciseData
    });

    await this.exerciseRepository.save(exercise);
    await this.batchEntityFetcherService.updateCache();

    return exercise;
  }

  public async update(id: string, dto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        manualAudio: true
      }
    });

    if (!exercise) {
      throw new NotFoundException("Exercise not found");
    }

    Object.assign(exercise, {
      ...dto,
      preparationGuideVideo: dto.preparationGuideVideoId,
      generalSafetyVideo: dto.generalSafetyVideoId,
      activityType: dto.activityTypeId,
      equipments: dto.equipmentIds,
      muscleGroups: dto.muscleGroups,
      coach: { id: dto.coachId }
    });

    if (dto.title) {
      const audio = await this.audioService.update(exercise.titleAudio.id, dto.title, "exercises/audio");

      exercise.titleAudio = audio;
    }

    if (
      dto.manualTitles &&
      dto.manualTitles.length > 0 &&
      dto.manualDescriptions &&
      dto.manualDescriptions.length > 0 &&
      !exercise.manualAudio
    ) {
      const combinedManual = await this.combineManualTitlesAndDescriptions(dto.manualTitles, dto.manualDescriptions);

      const audio = await this.audioService.create(combinedManual, "exercises/audio");

      exercise.manualAudio = audio;
    }

    if (
      dto.manualTitles &&
      dto.manualTitles.length > 0 &&
      dto.manualDescriptions &&
      dto.manualDescriptions.length > 0 &&
      exercise.manualAudio
    ) {
      const combinedManual = await this.combineManualTitlesAndDescriptions(dto.manualTitles, dto.manualDescriptions);

      const audio = await this.audioService.update(exercise.manualAudio.id, combinedManual, "exercises/audio");

      exercise.manualAudio = audio;
    }

    const equipmentIds: Equipments[] | undefined = dto.equipmentIds
      ? await validateEntitiesExistence<Equipments>(dto.equipmentIds, this.equipmentsRepository)
      : undefined;

    exercise.equipments = equipmentIds ?? exercise.equipments;

    const updatedExercise = await this.exerciseRepository.save(exercise);

    if (dto.effortLevel || dto.secsPerQuantityUnit || dto.rightLeftSeparately !== undefined) {
      await this.recalculateAllDurations(updatedExercise.id);
    }

    await this.batchEntityFetcherService.updateCache();

    return updatedExercise;
  }

  public async combineManualTitlesAndDescriptions(titles: string[], descriptions: string[]): Promise<string> {
    let combinedString = "";

    for (let i = 0; i < titles.length; i++) {
      combinedString += titles[i] + " " + descriptions[i];
    }

    combinedString = combinedString
      .replaceAll("\n", " ")
      .replace(/_.*?_/g, "")
      .replace(/\s+/g, " ")
      .replace(/\. */g, ".")
      .trim();

    return combinedString;
  }

  public async delete(id: string): Promise<void> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        manualAudio: true,
        primaryExercise: true,
        secondaryExercise: true
      }
    });

    if (!exercise) {
      throw new NotFoundException("Exercise not found");
    }

    if (exercise.primaryExercise.length > 0) {
      const primaryExerciseIds = exercise.primaryExercise.map((workoutExercise) => workoutExercise.id);
      await this.workoutExerciseService.handlePrimaryExerciseDeletion(primaryExerciseIds);
    }

    if (exercise.manualAudio) {
      await this.audioService.delete(exercise.manualAudio.id);
    }

    await this.audioService.delete(exercise.titleAudio.id);
    await this.awsS3Service.delete(exercise.imageUrl);

    if (exercise.videoUrl) {
      await this.awsS3Service.delete(exercise.videoUrl);
    }

    await this.exerciseRepository.remove(exercise);

    await this.recalculateAllDurations(exercise.id);
    await this.batchEntityFetcherService.updateCache();
  }

  public async deleteMany(dto: ExercisesIdsDto): Promise<void> {
    const exercises: Exercise[] = await validateEntitiesExistence<Exercise>(dto.exercisesIds, this.exerciseRepository, [
      "titleAudio",
      "primaryExercise",
      "secondaryExercise"
    ]);

    const exerciseIds: string[] = exercises.map((exercise) => exercise.id);
    const audioIds: string[] = [];
    const primaryExerciseIds: string[] = [];
    const videoUrls: string[] = [];
    const imageUrls: string[] = [];

    exercises.forEach((exercise) => {
      audioIds.push(exercise.titleAudio.id);

      if (exercise.videoUrl) {
        videoUrls.push(exercise.videoUrl);
      }

      if (exercise.imageUrl) {
        imageUrls.push(exercise.imageUrl);
      }

      if (exercise.primaryExercise.length > 0) {
        const ids = exercise.primaryExercise.map((workoutExercise) => workoutExercise.id);
        primaryExerciseIds.push(...ids);
      }
    });

    await this.audioService.deleteMany(audioIds);

    if (videoUrls.length > 0) {
      await Promise.all(videoUrls.map((video) => this.awsS3Service.delete(video)));
    }

    if (imageUrls.length > 0) {
      await Promise.all(imageUrls.map((image) => this.awsS3Service.delete(image)));
    }

    if (primaryExerciseIds.length > 0) {
      await this.workoutExerciseService.handlePrimaryExerciseDeletion(primaryExerciseIds);
    }

    await this.exerciseRepository.remove(exercises);
    await this.recalculateAllDurations(exerciseIds);
    await this.batchEntityFetcherService.updateCache();
  }

  public async recalculateAllDurations(exerciseIds: string | string[]): Promise<void> {
    if (!Array.isArray(exerciseIds)) {
      exerciseIds = [exerciseIds];
    }
    /**
     ** Recalculate WorkoutExercise duration
     */

    const workoutExercises = await this.workoutExerciseRepository.find({
      where: {
        primaryExercise: { id: In(exerciseIds) },
        secondaryExercise: { id: In(exerciseIds) }
      },
      relations: { primaryExercise: true, workout: true }
    });

    let countWorkoutExercises = 0;

    const [settings] = await this.settingsRepository.find();
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
    /**
     ** Recalculate Workout duration
     */

    const workoutsIds = workoutExercises.flatMap((workoutExercise) =>
      workoutExercise.workout.map((workout) => workout.id)
    );

    const workouts = await this.workoutRepository.find({
      where: { id: In(workoutsIds) },
      relations: {
        exerciseOrder: {
          primaryExercise: {
            equipments: true
          }
        }
      },
      order: { exerciseOrder: { ordinalNumber: ESortOrder.ASC } }
    });

    let countWorkouts = 0;

    for (const workout of workouts) {
      const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);

      await this.workoutRepository.update(workout.id, { duration });
      countWorkouts++;
      logger.data(`Processed Workout: ${workout.id} ${countWorkouts} of ${workouts.length}`);
    }
  }
}
