import { In, IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { logger } from "../../../setup/logger";
import {
  GetAllWorkoutsDto,
  GetRandomWorkoutQueryDto,
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutExerciseIdsDto
} from "../common/dto";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { getRandomElement, omitProperties } from "../../../common/helpers";
import { AwsS3Service } from "../../aws-s3/services";
import { Equipments } from "../../equipments/schemas";
import { Workout } from "../schemas";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { PaginationQueryOutput } from "../../../common/outputs";
import { ESortOrder } from "../../../common/enums";

export class WorkoutService {
  private readonly workoutRepository: Repository<Workout>;
  private readonly workoutExerciseRepository: Repository<WorkoutExercise>;

  constructor(private readonly awsS3Service = new AwsS3Service()) {
    this.workoutRepository = AppDataSource.getRepository(Workout);
    this.workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
  }

  public async getAll(dto: GetAllWorkoutsDto): Promise<PaginationQueryOutput<Workout>> {
    const [workout, total] = await this.workoutRepository.findAndCount({
      where: { coach: IsNull() },
      relations: { workoutCategory: true, focalBodyPart: true },
      order: {
        duration: ESortOrder.ASC
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: workout,
      pageNumber: dto.page,
      pageCount: totalPages
    };
  }

  public async getRandomWorkout(dto: GetRandomWorkoutQueryDto): Promise<Workout | null> {
    const { durationRanges, difficulties } = dto;

    const queryBuilder = this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoinAndSelect("workout.workoutCategory", "workoutCategory");

    if (durationRanges) {
      let durationQuery = "(";
      durationRanges.forEach(([_min, _max], index) => {
        durationQuery += `workout.duration BETWEEN :min${index} AND :max${index}`;

        if (index < durationRanges.length - 1) {
          durationQuery += " OR ";
        }
      });
      durationQuery += ")";

      const params = Object.fromEntries(
        durationRanges.flatMap(([min, max], index) => [
          [`min${index}`, min],
          [`max${index}`, max]
        ])
      );

      queryBuilder.andWhere(durationQuery, params);
    }

    if (difficulties) {
      queryBuilder.andWhere("workout.difficulty IN (:...difficulties)", {
        difficulties
      });
    }

    const allMatchingWorkouts = await queryBuilder.getMany();

    const randomWorkout = getRandomElement(allMatchingWorkouts);

    return randomWorkout;
  }

  public async getById(id: string): Promise<Workout | null> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: { workoutCategory: true, focalBodyPart: true }
    });

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    return workout;
  }

  public async getWorkoutExercisesInWorkout(id: string): Promise<WorkoutExercise[]> {
    const workoutExercises = await this.workoutExerciseRepository.find({
      where: { workout: { id } },
      relations: {
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
          titleAudio: true,
          manualAudio: true
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
      },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return workoutExercises;
  }

  public async create(dto: CreateWorkoutDto): Promise<Workout> {
    const workout = this.workoutRepository.create({
      ...dto,
      workoutCategory: dto.workoutCategoryId,
      focalBodyPart: dto.focalBodyPartId
    });
    await this.workoutRepository.save(workout);

    return workout;
  }

  public async copyById(id: string): Promise<Workout> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      const workout = await this.workoutRepository.findOne({
        where: { id },
        relations: {
          exerciseOrder: {
            primaryExercise: true,
            secondaryExercise: true
          },
          workoutCategory: true,
          focalBodyPart: true
        }
      });

      if (!workout) {
        throw new NotFoundException("Workout not found");
      }

      const { exerciseOrder, ...WorkoutDataWithoutOrder } = workout;
      const copyWorkoutData = omitProperties(WorkoutDataWithoutOrder, "id", "createdDate", "updatedDate");

      const copyWorkout = transactionalEntityManager.create(Workout, {
        ...copyWorkoutData,
        title: copyWorkoutData.title + " (Copy)",
        exerciseOrder: undefined
      });

      const extension = workout.imageUrl.split(".").pop();
      const newFileName = `${Date.now()}.${extension}`;
      const directory = "workouts/images";
      const newImageUrl = await this.awsS3Service.copyImage(copyWorkout.imageUrl, newFileName, directory);
      copyWorkout.imageUrl = newImageUrl;

      const savedCopyWorkout = await transactionalEntityManager.save(copyWorkout);

      const workoutExerciseIds = [];

      for (const workoutExercise of exerciseOrder) {
        const { primaryExercise, secondaryExercise, ...workoutExerciseData } = workoutExercise;
        const copyWorkoutExerciseData = omitProperties(workoutExerciseData, "id", "createdDate", "updatedDate");

        const copyWorkoutExercise = transactionalEntityManager.create(WorkoutExercise, {
          ...copyWorkoutExerciseData,
          primaryExercise: primaryExercise,
          secondaryExercise: secondaryExercise
        });
        const savedExercise = await transactionalEntityManager.save(copyWorkoutExercise);
        workoutExerciseIds.push(savedExercise.id);
      }

      const updatedWorkout = await transactionalEntityManager.findOne(Workout, {
        where: { id: savedCopyWorkout.id },
        relations: {
          exerciseOrder: true
        }
      });

      if (!updatedWorkout) {
        throw new NotFoundException("Copied Workout not found");
      }

      updatedWorkout.exerciseOrder = await transactionalEntityManager.find(WorkoutExercise, {
        where: { id: In(workoutExerciseIds) }
      });
      await transactionalEntityManager.save(updatedWorkout);

      return savedCopyWorkout;
    });
  }

  public async update(id: string, dto: UpdateWorkoutDto): Promise<Workout> {
    const workout = await this.workoutRepository.findOne({
      where: { id }
    });

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    Object.assign(workout, {
      ...dto,
      workoutCategory: dto.workoutCategoryId,
      focalBodyPart: dto.focalBodyPartId
    });

    const updatedWorkout = await this.workoutRepository.save(workout);

    return updatedWorkout;
  }

  public async updateWorkoutExercisesOrder(id: string, dto: WorkoutExerciseIdsDto): Promise<void> {
    if (!dto.workoutExerciseIds) {
      throw new BadRequestException("Workout-Exercise Ids must be provided");
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

    const workout = await this.workoutRepository.findOne({
      where: { id }
    });

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    logger.data(`calculateWorkoutDuration : ${workout.id}`);
    workout.duration = await this.calculateWorkoutDuration(calculateWorkout);
    await this.workoutRepository.save(workout);
  }

  public async delete(id: string): Promise<void> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: {
        exerciseOrder: true
      }
    });

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    await this.awsS3Service.delete(workout.imageUrl);

    if (workout.exerciseOrder.length > 0) {
      await this.workoutExerciseRepository.remove(workout.exerciseOrder);
    }

    await this.workoutRepository.remove(workout);
  }

  public async calculateWorkoutDuration(workoutExercises: WorkoutExercise[]): Promise<number> {
    const DECIMAL_PLACES = 2;

    let totalDuration = workoutExercises.reduce((previous, current) => previous + current.duration, 0);

    const lastViewedEquipments: Record<string, Equipments> = {};

    for (let i = 0; i < workoutExercises.length; i++) {
      const previousWorkoutExercise = i > 0 ? workoutExercises[i - 1] : null;
      const currentWorkoutExercise = workoutExercises[i];

      logger.data(
        `Ordinal number: ${currentWorkoutExercise.ordinalNumber} Current circuit: ${currentWorkoutExercise.circuit}`
      );

      const currentEquipments = this.getUniqueWorkoutExerciseEquipments(previousWorkoutExercise);

      const currentCircuit = previousWorkoutExercise?.circuit;

      const nextEquipments = this.getUniqueWorkoutExerciseEquipments(currentWorkoutExercise);

      const nextCircuit = currentWorkoutExercise.circuit;

      const equipmentsToRemove = this.getEquipmentsToRemove(currentEquipments, nextEquipments);

      const equipmentsToSetup = this.getEquipmentsToSetup(currentEquipments, nextEquipments);

      const equipmentsToAdjust = this.getEquipmentsToAdjust(
        currentEquipments,
        currentCircuit,
        nextEquipments,
        nextCircuit,
        lastViewedEquipments
      );

      equipmentsToRemove.forEach((equipment) => {
        logger.data(
          `Removal time for unused equipment ${equipment.keyTitle}-${equipment.priority}: +${equipment.removalDuration}`
        );

        delete lastViewedEquipments[equipment.keyTitle];
      });

      equipmentsToSetup.forEach((equipment) => {
        logger.data(
          `Setup time for new equipment ${equipment.keyTitle}-${equipment.priority}: +${equipment.setupDuration}`
        );

        lastViewedEquipments[equipment.keyTitle] = equipment;
      });

      equipmentsToAdjust.forEach((equipment) => {
        logger.data(
          `Adjustment time for equipment ${equipment.keyTitle}-${equipment.priority}: +${equipment.adjustmentDuration}`
        );

        lastViewedEquipments[equipment.keyTitle] = equipment;
      });

      totalDuration += equipmentsToSetup.reduce((previous, current) => previous + current.setupDuration, 0);

      totalDuration += equipmentsToRemove.reduce((previous, current) => previous + current.removalDuration, 0);

      totalDuration += equipmentsToAdjust.reduce((previous, current) => previous + current.adjustmentDuration, 0);
    }

    logger.data(`Total duration second:  ${totalDuration.toFixed(DECIMAL_PLACES)}`);

    return Number(totalDuration.toFixed(DECIMAL_PLACES));
  }

  private getEquipmentsToRemove(currentEquipments: Equipments[], nextEquipments: Equipments[]): Equipments[] {
    const equipmentsToRemove: Equipments[] = [];

    for (const currentEquipment of currentEquipments) {
      /**
       ** Check whether the next equipments contain the current equipment
       */
      if (nextEquipments.find((x) => x.keyTitle === currentEquipment.keyTitle)) {
        continue;
      }

      /**
       ** If the next equipments do not contain the current equipment, it must be added to the removal
       */
      equipmentsToRemove.push(currentEquipment);
    }

    return this.getUniqueLowPriorityEquipments(equipmentsToRemove).filter(
      (Equipment) => Equipment.removalDuration !== 0
    );
  }

  private getEquipmentsToSetup(currentEquipments: Equipments[], nextEquipments: Equipments[]): Equipments[] {
    const equipmentsToSetup: Equipments[] = [];

    for (const nextEquipment of nextEquipments) {
      /**
       ** Check whether the current equipments contain the next equipment
       */
      if (currentEquipments.find((Equipment) => Equipment.keyTitle === nextEquipment.keyTitle)) {
        continue;
      }

      /**
       ** If the current equipments do not contain the next equipment, it must be added to the setup
       */
      equipmentsToSetup.push(nextEquipment);
    }

    return this.getUniqueLowPriorityEquipments(equipmentsToSetup).filter((Equipment) => Equipment.setupDuration !== 0);
  }

  private getEquipmentsToAdjust(
    currentEquipments: Equipments[],
    currentCircuit: string | undefined,
    nextEquipments: Equipments[],
    nextCircuit: string,
    lastViewedEquipments: Record<string, Equipments>
  ): Equipments[] {
    if (!currentCircuit) {
      return [];
    }

    const equipmentsToAdjust: Equipments[] = [];

    if (currentCircuit !== nextCircuit) {
      for (const nextEquipment of nextEquipments) {
        /**
         ** Check whether the current equipments contain the next equipment
         */
        if (!currentEquipments.find((Equipment) => Equipment.keyTitle === nextEquipment.keyTitle)) {
          continue;
        }

        /**
         ** If the current equipments contain the next equipment, it must be added to the adjustment
         */
        equipmentsToAdjust.push(nextEquipment);
      }

      return this.getUniqueLowPriorityEquipments(equipmentsToAdjust).filter(
        (Equipment) => Equipment.adjustmentDuration !== 0
      );
    }

    const currentGroupedEquipments = this.getGroupedEquipments(currentEquipments);
    const nextGroupedEquipments = this.getGroupedEquipments(nextEquipments);

    for (const nextEquipment of nextEquipments) {
      if (!currentGroupedEquipments[nextEquipment.keyTitle]) {
        continue;
      }

      const currentEquipmentsWithEqualKeyTitle = currentGroupedEquipments[nextEquipment.keyTitle];
      const nextEquipmentsWithEqualKeyTitle = nextGroupedEquipments[nextEquipment.keyTitle];

      const currentLowPriorityEquipment = this.getLowPriorityEquipment(currentEquipmentsWithEqualKeyTitle);
      const nextLowPriorityEquipment = this.getLowPriorityEquipment(nextEquipmentsWithEqualKeyTitle);

      if (currentEquipmentsWithEqualKeyTitle.length < nextEquipmentsWithEqualKeyTitle.length) {
        if (currentLowPriorityEquipment.id === nextLowPriorityEquipment.id) {
          continue;
        }

        if (nextEquipmentsWithEqualKeyTitle.find((Equipment) => Equipment.id === currentLowPriorityEquipment.id)) {
          continue;
        }
      }

      if (nextEquipmentsWithEqualKeyTitle.length === 1) {
        if (currentEquipmentsWithEqualKeyTitle.length === 1) {
          if (!currentEquipmentsWithEqualKeyTitle.find((Equipment) => Equipment.id === nextEquipment.id)) {
            equipmentsToAdjust.push(nextEquipment);
          }

          continue;
        } else if (currentEquipmentsWithEqualKeyTitle.length > 1) {
          equipmentsToAdjust.push(nextEquipment);

          continue;
        }
      }

      if (currentLowPriorityEquipment.id !== nextLowPriorityEquipment.id) {
        equipmentsToAdjust.push(nextLowPriorityEquipment);
      }
    }

    return this.getUniqueLowPriorityEquipments(equipmentsToAdjust)
      .filter((Equipment) => Equipment.adjustmentDuration !== 0)
      .filter((Equipment) => Equipment.id !== lastViewedEquipments[Equipment.keyTitle]?.id);
  }

  /**
   ** Group equipment by 'keyTitle':
   * {
   *   "Strap System": [
   *     { title: "Strap System - High Height", keyTitle: "Strap System" ...  },
   *     { title: "Strap System - Medium Height", keyTitle: "Strap System" ...  }
   *   ]
   * }
   */
  private getGroupedEquipments(equipments: Equipments[]): Record<string, Equipments[]> {
    return equipments.reduce<Record<string, Equipments[]>>((previous, current) => {
      if (!previous[current.keyTitle]) {
        previous[current.keyTitle] = [];
      }

      previous[current.keyTitle].push(current);

      return previous;
    }, {});
  }

  private getUniqueWorkoutExerciseEquipments(workoutExercise: WorkoutExercise | null): Equipments[] {
    if (!workoutExercise) {
      return [];
    }

    const primaryExerciseEquipments = workoutExercise.primaryExercise?.equipments;
    const secondaryExerciseEquipments = workoutExercise.secondaryExercise?.equipments ?? [];

    return [
      ...primaryExerciseEquipments!,
      ...secondaryExerciseEquipments.filter(
        (Equipments) => !primaryExerciseEquipments?.find((Equipment) => Equipments.id === Equipment.id)
      )
    ];
  }

  private getUniqueLowPriorityEquipments(equipments: Equipments[]): Equipments[] {
    return Object.values(this.getGroupedEquipments(equipments)).map(this.getLowPriorityEquipment);
  }

  private getLowPriorityEquipment(equipments: Equipments[]): Equipments {
    return [...equipments].sort((EquipmentA, EquipmentB) => EquipmentA.priority - EquipmentB.priority)[0];
  }
}
