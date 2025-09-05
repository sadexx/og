import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException, BadRequestException } from "../../../common/exceptions";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import {
  CreateLowerBodyMovementTypeDto,
  UpdateLowerBodyMovementTypeDto,
  LowerBodyMovementTypeIdsDto
} from "../common/dto";
import { LowerBodyMovementType } from "../schemas";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { ESortOrder } from "../../../common/enums";

export class LowerBodyMovementTypeService {
  private readonly lowerBodyMovementTypeRepository: Repository<LowerBodyMovementType>;
  private readonly relations = {
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
  };

  constructor(private readonly batchEntityFetcherService = new BatchEntityFetcherService()) {
    this.lowerBodyMovementTypeRepository = AppDataSource.getRepository(LowerBodyMovementType);
  }

  public async getAll(): Promise<LowerBodyMovementType[]> {
    const lowerBodyMovementTypes = await this.lowerBodyMovementTypeRepository.find({
      relations: this.relations,
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return lowerBodyMovementTypes;
  }

  public async getById(id: string): Promise<LowerBodyMovementType | null> {
    const lowerBodyMovementType = await this.lowerBodyMovementTypeRepository.findOne({
      where: { id },
      relations: this.relations
    });

    if (!lowerBodyMovementType) {
      throw new NotFoundException("Lower-body-movement-type not found");
    }

    return lowerBodyMovementType;
  }

  public async create(dto: CreateLowerBodyMovementTypeDto): Promise<LowerBodyMovementType> {
    const lowerBodyMovementType = this.lowerBodyMovementTypeRepository.create({
      ...dto,
      exercise: dto.exerciseId
    });
    const lowerBodyMovementTypes = await this.lowerBodyMovementTypeRepository.find();

    lowerBodyMovementType.ordinalNumber = getNextOrdinalNumber(lowerBodyMovementTypes);
    await this.lowerBodyMovementTypeRepository.save(lowerBodyMovementType);
    await this.batchEntityFetcherService.updateCache();

    return lowerBodyMovementType;
  }

  public async update(id: string, dto: UpdateLowerBodyMovementTypeDto): Promise<LowerBodyMovementType> {
    const lowerBodyMovementType = await this.lowerBodyMovementTypeRepository.findOne({
      where: { id }
    });

    if (!lowerBodyMovementType) {
      throw new NotFoundException("Lower-body-movement-type not found");
    }

    const updatedLowerBodyMovementType = this.lowerBodyMovementTypeRepository.merge(lowerBodyMovementType, {
      ...dto,
      exercise: dto.exerciseId
    });
    await this.lowerBodyMovementTypeRepository.save(updatedLowerBodyMovementType);
    await this.batchEntityFetcherService.updateCache();

    return updatedLowerBodyMovementType;
  }

  public async updateLowerBodyMovementTypeOrder(dto: LowerBodyMovementTypeIdsDto): Promise<void> {
    if (!dto.lowerBodyMovementTypeIds || dto.lowerBodyMovementTypeIds.length === 0) {
      throw new BadRequestException("Lower-body-movement-type ids are required");
    }

    const lowerBodyMovementTypes = await this.lowerBodyMovementTypeRepository.findBy({
      id: In(dto.lowerBodyMovementTypeIds)
    });

    const orderMap: Map<string, number> = new Map(dto.lowerBodyMovementTypeIds.map((id, index) => [id, index + 1]));

    lowerBodyMovementTypes.forEach((bodyMovement) => {
      const newOrder = orderMap.get(bodyMovement.id);

      if (newOrder !== undefined) {
        bodyMovement.ordinalNumber = newOrder;
      }
    });

    await this.lowerBodyMovementTypeRepository.save(lowerBodyMovementTypes);
  }

  public async delete(id: string): Promise<void> {
    const lowerBodyMovementType = await this.lowerBodyMovementTypeRepository.findOne({
      where: { id }
    });

    if (!lowerBodyMovementType) {
      throw new NotFoundException("Lower-body-movement-type not found");
    }

    await this.lowerBodyMovementTypeRepository.remove(lowerBodyMovementType);
    await this.batchEntityFetcherService.updateCache();
  }
}
