import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { WorkoutCategory } from "../schemas";
import {
  GetWorkoutInCategoryQueryDto,
  CreateWorkoutCategoryDto,
  UpdateWorkoutCategoryDto,
  WorkoutCategoryIdsDto
} from "../common/dto";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { getNextOrdinalNumber, validateEntitiesExistence } from "../../../common/helpers";
import { AwsS3Service } from "../../aws-s3/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { FocalBodyPart } from "../../focal-body-parts/schemas";
import { Workout } from "../../workout/schemas";
import { PaginationQueryOutput } from "../../../common/outputs";
import { ESortOrder } from "../../../common/enums";

export class WorkoutCategoryService {
  private readonly workoutCategoryRepository: Repository<WorkoutCategory>;
  private readonly workoutRepository: Repository<Workout>;
  private readonly focalBodyPartRepository: Repository<FocalBodyPart>;

  constructor(
    private readonly awsS3Service = new AwsS3Service(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.workoutCategoryRepository = AppDataSource.getRepository(WorkoutCategory);
    this.workoutRepository = AppDataSource.getRepository(Workout);
    this.focalBodyPartRepository = AppDataSource.getRepository(FocalBodyPart);
  }

  public async getAll(): Promise<WorkoutCategory[]> {
    const workoutCategory = await this.workoutCategoryRepository.find({
      order: { ordinalNumber: ESortOrder.ASC },
      relations: {
        focalBodyParts: true,
        defaultLowerBodyMovementType: {
          exercise: {
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
        }
      }
    });

    return workoutCategory;
  }

  public async getById(id: string): Promise<WorkoutCategory | null> {
    const workoutCategory = await this.workoutCategoryRepository.findOne({
      where: { id },
      relations: {
        focalBodyParts: true,
        defaultLowerBodyMovementType: true
      }
    });

    if (!workoutCategory) {
      throw new NotFoundException("Workout-category not found");
    }

    return workoutCategory;
  }

  public async getWorkoutInWorkoutCategory(
    id: string,
    dto: GetWorkoutInCategoryQueryDto
  ): Promise<PaginationQueryOutput<Workout>> {
    const { page, limit, durationRanges, difficulties, focalBodyPartIds } = dto;

    const queryBuilder = this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoinAndSelect("workout.focalBodyPart", "focalBodyPart");
    queryBuilder.where("workout.workoutCategory = :id", { id });

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

    if (focalBodyPartIds && focalBodyPartIds.length > 0) {
      queryBuilder.andWhere("focalBodyPart.id IN (:...focalBodyPartIds)", {
        focalBodyPartIds
      });
    }

    queryBuilder.orderBy("workout.duration", "ASC");

    let pageNumber = 1;

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      pageNumber = page;
    }

    const [workouts, total] = await queryBuilder.getManyAndCount();

    return {
      data: workouts,
      pageNumber,
      pageCount: Math.ceil(total / limit)
    };
  }

  public async create(dto: CreateWorkoutCategoryDto): Promise<WorkoutCategory> {
    const { focalBodyPartIds: focalBodyPartsArrayIds, defaultLowerBodyMovementTypeId, ...workoutCategoryData } = dto;

    const focalBodyPartsIds: FocalBodyPart[] = await validateEntitiesExistence<FocalBodyPart>(
      focalBodyPartsArrayIds,
      this.focalBodyPartRepository
    );

    const workoutCategory = this.workoutCategoryRepository.create({
      focalBodyParts: focalBodyPartsIds,
      defaultLowerBodyMovementType: defaultLowerBodyMovementTypeId,
      ...workoutCategoryData
    });
    const workoutCategories = await this.workoutCategoryRepository.find();

    workoutCategory.ordinalNumber = getNextOrdinalNumber(workoutCategories);
    await this.workoutCategoryRepository.save(workoutCategory);
    await this.batchEntityFetcherService.updateCache();

    return workoutCategory;
  }

  public async update(id: string, dto: UpdateWorkoutCategoryDto): Promise<WorkoutCategory> {
    const workoutCategory = await this.workoutCategoryRepository.findOne({
      where: { id }
    });

    if (!workoutCategory) {
      throw new NotFoundException("Workout-category not found");
    }

    Object.assign(workoutCategory, {
      ...dto,
      focalBodyParts: dto.focalBodyPartIds,
      defaultLowerBodyMovementType: dto.defaultLowerBodyMovementTypeId
    });

    const focalBodyPartsIds: FocalBodyPart[] | undefined = dto.focalBodyPartIds
      ? await validateEntitiesExistence(dto.focalBodyPartIds, this.focalBodyPartRepository)
      : undefined;

    workoutCategory.focalBodyParts = focalBodyPartsIds ?? workoutCategory.focalBodyParts;

    const updatedWorkoutCategory = await this.workoutCategoryRepository.save(workoutCategory);
    await this.batchEntityFetcherService.updateCache();

    return updatedWorkoutCategory;
  }

  public async updateWorkoutCategoryOrder(dto: WorkoutCategoryIdsDto): Promise<void> {
    if (!dto.workoutCategoryIds || dto.workoutCategoryIds.length === 0) {
      throw new BadRequestException("Workout-category ids are required");
    }

    const workoutCategories = await this.workoutCategoryRepository.findBy({
      id: In(dto.workoutCategoryIds)
    });

    const orderMap: Map<string, number> = new Map(dto.workoutCategoryIds.map((id, index) => [id, index + 1]));

    workoutCategories.forEach((workoutCategory) => {
      const newOrder = orderMap.get(workoutCategory.id);

      if (newOrder !== undefined) {
        workoutCategory.ordinalNumber = newOrder;
      }
    });

    await this.workoutCategoryRepository.save(workoutCategories);
  }

  public async delete(id: string): Promise<void> {
    const workoutCategory = await this.workoutCategoryRepository.findOne({
      where: { id },
      relations: {
        workout: true
      }
    });

    if (!workoutCategory) {
      throw new NotFoundException("Workout-category not found");
    }

    if (workoutCategory.workout && workoutCategory.workout.length > 0) {
      throw new BadRequestException("Cannot delete a workout-category associated with an workout");
    }

    await this.awsS3Service.delete(workoutCategory.imageUrl);

    await this.workoutCategoryRepository.remove(workoutCategory);
    await this.batchEntityFetcherService.updateCache();
  }
}
