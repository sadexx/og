import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import {
  CreateJustMetricsWorkoutExerciseTypeDto,
  UpdateJustMetricsWorkoutExerciseTypeDto,
  JustMetricsWorkoutExerciseTypeIdsDto
} from "../common/dto";
import { JustMetricsWorkoutExerciseType } from "../schemas";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { ESortOrder } from "../../../common/enums";

export class JustMetricsWorkoutExerciseTypeService {
  private readonly justMetricsWorkoutExerciseTypeRepository: Repository<JustMetricsWorkoutExerciseType>;

  constructor() {
    this.justMetricsWorkoutExerciseTypeRepository = AppDataSource.getRepository(JustMetricsWorkoutExerciseType);
  }

  public async getAll(): Promise<JustMetricsWorkoutExerciseType[]> {
    const justMetricsWorkoutExerciseTypes = await this.justMetricsWorkoutExerciseTypeRepository.find({
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return justMetricsWorkoutExerciseTypes;
  }

  public async getById(id: string): Promise<JustMetricsWorkoutExerciseType | null> {
    const justMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeRepository.findOne({
      where: { id }
    });

    if (!justMetricsWorkoutExerciseType) {
      throw new NotFoundException("Just-metrics-workout-exercise-type not found");
    }

    return justMetricsWorkoutExerciseType;
  }

  public async create(dto: CreateJustMetricsWorkoutExerciseTypeDto): Promise<JustMetricsWorkoutExerciseType> {
    const justMetricsWorkoutExerciseType = this.justMetricsWorkoutExerciseTypeRepository.create(dto);
    const justMetricsWorkoutExerciseTypes = await this.justMetricsWorkoutExerciseTypeRepository.find();

    justMetricsWorkoutExerciseType.ordinalNumber = getNextOrdinalNumber(justMetricsWorkoutExerciseTypes);
    await this.justMetricsWorkoutExerciseTypeRepository.save(justMetricsWorkoutExerciseType);

    return justMetricsWorkoutExerciseType;
  }

  public async update(
    id: string,
    dto: UpdateJustMetricsWorkoutExerciseTypeDto
  ): Promise<JustMetricsWorkoutExerciseType> {
    const justMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeRepository.findOne({
      where: { id }
    });

    if (!justMetricsWorkoutExerciseType) {
      throw new NotFoundException("Just-metrics-workout-exercise-type not found");
    }

    const updatedJustMetricsWorkoutExerciseType = this.justMetricsWorkoutExerciseTypeRepository.merge(
      justMetricsWorkoutExerciseType,
      dto
    );
    await this.justMetricsWorkoutExerciseTypeRepository.save(updatedJustMetricsWorkoutExerciseType);

    return updatedJustMetricsWorkoutExerciseType;
  }

  public async updateJustMetricsWorkoutExerciseTypesOrder(dto: JustMetricsWorkoutExerciseTypeIdsDto): Promise<void> {
    if (!dto.justMetricsWorkoutExerciseTypeIds || dto.justMetricsWorkoutExerciseTypeIds.length === 0) {
      throw new BadRequestException("Grip-type ids are required");
    }

    const justMetricsWorkoutExerciseTypes = await this.justMetricsWorkoutExerciseTypeRepository.findBy({
      id: In(dto.justMetricsWorkoutExerciseTypeIds)
    });

    const orderMap: Map<string, number> = new Map(
      dto.justMetricsWorkoutExerciseTypeIds.map((id, index) => [id, index + 1])
    );

    justMetricsWorkoutExerciseTypes.forEach((gripType) => {
      const newOrder = orderMap.get(gripType.id);

      if (newOrder !== undefined) {
        gripType.ordinalNumber = newOrder;
      }
    });

    await this.justMetricsWorkoutExerciseTypeRepository.save(justMetricsWorkoutExerciseTypes);
  }

  public async delete(id: string): Promise<void> {
    const updatedJustMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeRepository.findOne({
      where: { id }
    });

    if (!updatedJustMetricsWorkoutExerciseType) {
      throw new NotFoundException("Just-metrics-workout-exercise-type not found");
    }

    await this.justMetricsWorkoutExerciseTypeRepository.remove(updatedJustMetricsWorkoutExerciseType);
  }
}
