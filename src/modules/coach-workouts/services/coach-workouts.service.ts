import { FindOptionsSelect, FindOptionsWhere, In, IsNull, Not, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Workout } from "../../workout/schemas";
import { Coach } from "../../coach/schemas";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../common/exceptions";
import { EWorkoutStatus } from "../../workout/common/enums";
import { PaginationQueryOutput } from "../../../common/outputs";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { AwsS3Service } from "../../aws-s3/services";
import { JwtPayload } from "../../auth/common/dto";
import { ERole } from "../../users/common/enums";
import { UserSubscriptionsManagementService } from "../../user-subscriptions/services";
import { ESortOrder } from "../../../common/enums";
import { WorkoutExerciseIdsDto } from "../../workout/common/dto";
import { WorkoutService } from "../../workout/services";
import { logger } from "../../../setup/logger";
import {
  GetVerifiedCoachWorkoutsDto,
  GetUnverifiedCoachWorkoutsDto,
  CreateCoachWorkoutDto,
  UpdateCoachWorkoutDto,
  CoachWorkoutManualDecisionDto
} from "../common/dto";

export class CoachWorkoutsService {
  private readonly coachRepository: Repository<Coach>;
  private readonly workoutRepository: Repository<Workout>;
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;

  private readonly selectOptions: FindOptionsSelect<Workout> = {
    id: true,
    title: true,
    description: true,
    difficulty: true,
    enduranceLevel: true,
    duration: true,
    imageUrl: true,
    joggingDrillsStretchingId: true,
    warmUpStretchingId: true,
    coolDownStretchingId: true,
    status: true,
    createdDate: true,
    updatedDate: true,
    coach: {
      id: true,
      description: true,
      user: {
        id: true,
        name: true,
        email: true
      }
    }
  };

  constructor(
    private readonly workoutsService = new WorkoutService(),
    private readonly awsS3Service = new AwsS3Service(),
    private readonly userSubscriptionsManagementService = new UserSubscriptionsManagementService()
  ) {
    this.coachRepository = AppDataSource.getRepository(Coach);
    this.workoutRepository = AppDataSource.getRepository(Workout);
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
  }

  public async getVerifiedCoachWorkouts(
    user: JwtPayload,
    dto: GetVerifiedCoachWorkoutsDto
  ): Promise<PaginationQueryOutput<Workout>> {
    if (user.role !== ERole.ADMIN && !dto.coachId) {
      throw new BadRequestException("coachId should not be empty.");
    }

    const whereCondition: FindOptionsWhere<Workout> = {
      status: EWorkoutStatus.VERIFIED
    };

    if (dto.coachId) {
      const coach = await this.coachRepository.findOne({
        where: { id: dto.coachId }
      });

      if (!coach) {
        throw new NotFoundException("Coach not found.");
      }

      whereCondition.coach = { id: dto.coachId };
    } else {
      whereCondition.coach = Not(IsNull());
    }

    if (user.role !== ERole.ADMIN && dto.coachId) {
      await this.userSubscriptionsManagementService.ensureUserSubscribedToCoach(user, dto.coachId);
    }

    const [coachWorkouts, total] = await this.workoutRepository.findAndCount({
      select: this.selectOptions,
      where: whereCondition,
      relations: {
        workoutCategory: true,
        focalBodyPart: true,
        coach: { user: true }
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    return {
      data: coachWorkouts,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getUnverifiedCoachWorkouts(
    user: JwtPayload,
    dto: GetUnverifiedCoachWorkoutsDto
  ): Promise<PaginationQueryOutput<Workout>> {
    if (user.role !== ERole.ADMIN && !dto.coachId) {
      throw new BadRequestException("coachId should not be empty.");
    }

    if (user.role === ERole.COACH && dto.coachId) {
      await this.ensureCoachOwnWorkout(
        user,
        dto.coachId,
        "You are not allowed to view other coaches unverified workouts."
      );
    }

    const whereCondition: FindOptionsWhere<Workout> = {
      status: In(dto.statuses)
    };

    if (dto.coachId) {
      const coach = await this.coachRepository.findOne({
        where: { id: dto.coachId }
      });

      if (!coach) {
        throw new NotFoundException("Coach not found.");
      }

      whereCondition.coach = { id: dto.coachId };
    } else {
      whereCondition.coach = Not(IsNull());
    }

    const [coachWorkouts, total] = await this.workoutRepository.findAndCount({
      select: this.selectOptions,
      where: whereCondition,
      relations: {
        workoutCategory: true,
        focalBodyPart: true,
        coach: { user: true }
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    return {
      data: coachWorkouts,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async getCoachWorkoutById(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: { workoutCategory: true, focalBodyPart: true }
    });

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    return workout;
  }

  public async createCoachWorkout(userId: string, dto: CreateCoachWorkoutDto): Promise<Workout> {
    const coach = await this.coachRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!coach) {
      throw new NotFoundException("Coach not found.");
    }

    const workout = this.workoutRepository.create({
      ...dto,
      workoutCategory: dto.workoutCategoryId,
      focalBodyPart: dto.focalBodyPartId,
      status: EWorkoutStatus.PENDING,
      coach
    });
    await this.workoutRepository.save(workout);

    return workout;
  }

  public async updateCoachWorkout(id: string, user: JwtPayload, dto: UpdateCoachWorkoutDto): Promise<Workout> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: { coach: true }
    });

    if (!workout || !workout.coach) {
      throw new NotFoundException("Workout not found");
    }

    if (user.role === ERole.COACH) {
      await this.ensureCoachOwnWorkout(user, workout.coach.id, "You are not allowed to edit other coaches workouts.");
    }

    Object.assign(workout, {
      ...dto,
      workoutCategory: dto.workoutCategoryId,
      focalBodyPart: dto.focalBodyPartId
    });

    const updatedWorkout = await this.workoutRepository.save(workout);

    return updatedWorkout;
  }

  public async coachWorkoutManualDecision(id: string, dto: CoachWorkoutManualDecisionDto): Promise<void> {
    const workout = await this.workoutRepository.findOne({ where: { id } });

    if (!workout) {
      throw new NotFoundException("Workout not found.");
    }

    await this.workoutRepository.update(id, { status: dto.status });
  }

  public async updateCoachWorkoutExercisesOrder(
    id: string,
    user: JwtPayload,
    dto: WorkoutExerciseIdsDto
  ): Promise<void> {
    if (!dto.workoutExerciseIds) {
      throw new BadRequestException("Workout-Exercise Ids must be provided");
    }

    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: { coach: true }
    });

    if (!workout || !workout.coach) {
      throw new NotFoundException("Workout not found");
    }

    if (user.role === ERole.COACH) {
      await this.ensureCoachOwnWorkout(
        user,
        workout.coach.id,
        "You are not allowed to change exercise order of other coaches."
      );
    }

    const workoutExercises = await this.workoutExerciseRepository.find({
      where: { workout: { id } }
    });

    const orderMap: Map<string, number> = new Map(dto.workoutExerciseIds.map((id, index) => [id, index + 1]));

    workoutExercises.forEach((exercise) => {
      const newOrder = orderMap.get(exercise.id);

      if (newOrder !== undefined) {
        exercise.ordinalNumber = newOrder;
      }
    });

    await this.workoutExerciseRepository.save(workoutExercises);

    const calculateWorkout = await this.workoutExerciseRepository.find({
      where: { id: In(dto.workoutExerciseIds) },
      relations: {
        primaryExercise: {
          equipments: true
        }
      },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    logger.data(`calculateWorkoutDuration : ${workout.id}`);
    workout.duration = await this.workoutsService.calculateWorkoutDuration(calculateWorkout);
    await this.workoutRepository.save(workout);
  }

  public async deleteCoachWorkout(id: string, user: JwtPayload): Promise<void> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: {
        exerciseOrder: true,
        coach: true
      }
    });

    if (!workout || !workout.coach) {
      throw new NotFoundException("Workout not found");
    }

    if (user.role === ERole.COACH) {
      await this.ensureCoachOwnWorkout(
        user,
        workout.coach.id,
        "You are not allowed to delete workouts of other coaches."
      );
    }

    await this.awsS3Service.delete(workout.imageUrl);

    if (workout.exerciseOrder.length > 0) {
      await this.workoutExerciseRepository.remove(workout.exerciseOrder);
    }

    await this.workoutRepository.remove(workout);
  }

  public async ensureCoachOwnWorkout(user: JwtPayload, coachId: string, errorMessage: string): Promise<void> {
    const currentCoach = await this.coachRepository.findOne({
      where: { user: { id: user.id } }
    });

    if (currentCoach && currentCoach.id !== coachId) {
      throw new ForbiddenException(errorMessage);
    }
  }
}
