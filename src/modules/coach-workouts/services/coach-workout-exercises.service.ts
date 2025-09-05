import { FindOptionsRelations, Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { Exercise } from "../../exercise/schemas";
import { Settings } from "../../settings/schemas";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { Workout } from "../../workout/schemas";
import { WorkoutService } from "../../workout/services";
import { WorkoutExerciseService } from "../../workout-exercise/services";
import { Coach } from "../../coach/schemas";
import { PaginationQueryOutput } from "../../../common/outputs";
import {
  GetCoachExercisesByWorkoutDto,
  CreateCoachWorkoutExerciseDto,
  UpdateCoachWorkoutExerciseDto
} from "../common/dto";
import { JwtPayload } from "../../auth/common/dto";
import { ERole } from "../../users/common/enums";
import { CoachWorkoutsService } from "./coach-workouts.service";

export class CoachWorkoutExercisesService {
  private readonly coachRepository: Repository<Coach>;
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;
  private readonly settingsRepository: Repository<Settings>;
  private readonly exerciseRepository: Repository<Exercise>;
  private readonly workoutRepository: Repository<Workout>;

  private findWorkoutQuery(workoutId: string[], coachId: string): SelectQueryBuilder<Workout> {
    return this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoinAndSelect("workout.exerciseOrder", "exerciseOrder")
      .leftJoinAndSelect("exerciseOrder.primaryExercise", "primaryExercise")
      .leftJoinAndSelect("primaryExercise.equipments", "primaryEquipments")
      .leftJoinAndSelect("exerciseOrder.secondaryExercise", "secondaryExercise")
      .leftJoinAndSelect("secondaryExercise.equipments", "secondaryEquipments")
      .where("workout.id IN (:...ids)", { ids: workoutId })
      .andWhere("workout.coach_id = :coachId", { coachId })
      .orderBy("exerciseOrder.ordinalNumber", "ASC");
  }

  private readonly relations: FindOptionsRelations<WorkoutExercise> = {
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
    },
    coach: true
  };

  constructor(
    private readonly workoutService = new WorkoutService(),
    private readonly workoutExerciseService = new WorkoutExerciseService(),
    private readonly coachWorkoutsService = new CoachWorkoutsService()
  ) {
    this.coachRepository = AppDataSource.getRepository(Coach);
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    this.settingsRepository = AppDataSource.getRepository(Settings);
    this.exerciseRepository = AppDataSource.getRepository(Exercise);
    this.workoutRepository = AppDataSource.getRepository(Workout);
  }

  public async getCoachExercisesByWorkout(
    dto: GetCoachExercisesByWorkoutDto
  ): Promise<PaginationQueryOutput<WorkoutExercise>> {
    const workout = await this.workoutRepository.findOne({
      where: { id: dto.workoutId },
      relations: { coach: true }
    });

    if (!workout || !workout.coach) {
      throw new NotFoundException("Workout not found");
    }

    const [workoutExercises, total] = await this.workoutExerciseRepository.findAndCount({
      where: { workout: { id: workout.id } },
      relations: this.relations,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    return {
      data: workoutExercises,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getCoachWorkoutExerciseById(id: string): Promise<WorkoutExercise | null> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: this.relations
    });

    if (!workoutExercise || !workoutExercise.coach) {
      throw new NotFoundException("Workout-exercise not found");
    }

    return workoutExercise;
  }

  public async createCoachWorkoutExercise(
    userId: string,
    dto: CreateCoachWorkoutExerciseDto
  ): Promise<WorkoutExercise> {
    const coach = await this.coachRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!coach) {
      throw new NotFoundException("Coach not found.");
    }

    const workout = await this.findWorkoutQuery([dto.workoutId], coach.id).getOne();

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
      secondaryExercise: dto.secondaryExerciseId,
      coach
    });
    workoutExercise.ordinalNumber = getNextOrdinalNumber(workout.exerciseOrder);

    const [settings] = await this.settingsRepository.find();
    workoutExercise.duration = await this.workoutExerciseService.calculateWorkoutExerciseDuration(
      workoutExercise,
      primaryExercise,
      settings
    );

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

  public async updateCoachWorkoutExercise(
    id: string,
    user: JwtPayload,
    dto: UpdateCoachWorkoutExerciseDto
  ): Promise<WorkoutExercise> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: { primaryExercise: true, workout: true, coach: true }
    });

    if (!workoutExercise || !workoutExercise.coach) {
      throw new NotFoundException("Workout-exercise not found");
    }

    if (user.role === ERole.COACH) {
      await this.coachWorkoutsService.ensureCoachOwnWorkout(
        user,
        workoutExercise.coach.id,
        "You are not allowed to edit exercises of other coaches."
      );
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
    updatedWorkoutExercise.duration = await this.workoutExerciseService.calculateWorkoutExerciseDuration(
      updatedWorkoutExercise,
      workoutExercise.primaryExercise,
      settings
    );

    await this.workoutExerciseRepository.save(updatedWorkoutExercise);

    if (updatedWorkoutExercise.workout.length > 0) {
      const workoutId = updatedWorkoutExercise.workout.map((workout) => workout.id);
      const workout = await this.findWorkoutQuery(workoutId, workoutExercise.coach.id).getOne();

      if (!workout) {
        throw new NotFoundException("Workout not found");
      }

      const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);
      await this.workoutRepository.update(workout.id, { duration });
    }

    return updatedWorkoutExercise;
  }

  public async deleteCoachWorkoutExercise(id: string, user: JwtPayload): Promise<void> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: { workout: true, coach: true }
    });

    if (!workoutExercise || !workoutExercise.coach) {
      throw new NotFoundException("Workout-exercise not found");
    }

    if (user.role === ERole.COACH) {
      await this.coachWorkoutsService.ensureCoachOwnWorkout(
        user,
        workoutExercise.coach.id,
        "You are not allowed to delete exercises of other coaches."
      );
    }

    const workoutId = workoutExercise.workout.map((workout) => workout.id);
    await this.workoutExerciseRepository.remove(workoutExercise);
    const workout = await this.findWorkoutQuery(workoutId, workoutExercise.coach.id).getOne();

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    const duration = await this.workoutService.calculateWorkoutDuration(workout.exerciseOrder);
    await this.workoutRepository.update(workout.id, { duration });
  }
}
