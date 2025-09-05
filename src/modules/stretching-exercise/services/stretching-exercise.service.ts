import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { Stretching } from "../../stretching/schemas";
import { StretchingExercise } from "../schemas";
import { CreateStretchingExerciseDto, UpdateStretchingExerciseDto } from "../common/dto";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { ESortOrder } from "../../../common/enums";

export class StretchingExerciseService {
  private readonly stretchingExerciseRepository: Repository<StretchingExercise>;
  private readonly stretchingRepository: Repository<Stretching>;
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

  constructor() {
    this.stretchingExerciseRepository = AppDataSource.getRepository(StretchingExercise);
    this.stretchingRepository = AppDataSource.getRepository(Stretching);
  }

  public async getById(id: string): Promise<StretchingExercise | null> {
    const stretchingExercise = await this.stretchingExerciseRepository.findOne({
      where: { id },
      relations: this.relations
    });

    if (!stretchingExercise) {
      throw new NotFoundException("Stretching-exercises not found");
    }

    return stretchingExercise;
  }

  public async create(dto: CreateStretchingExerciseDto): Promise<StretchingExercise> {
    const stretching = await this.stretchingRepository.findOne({
      where: { id: dto.stretchingId },
      relations: { exerciseOrder: true },
      order: { exerciseOrder: { ordinalNumber: ESortOrder.ASC } }
    });

    if (!stretching) {
      throw new NotFoundException("Stretching not found");
    }

    const stretchingExercise = this.stretchingExerciseRepository.create({
      ...dto,
      exercise: dto.exerciseId
    });
    stretchingExercise.ordinalNumber = getNextOrdinalNumber(stretching.exerciseOrder);
    await this.stretchingExerciseRepository.save(stretchingExercise);
    stretching.exerciseOrder = [...stretching.exerciseOrder, stretchingExercise];
    await this.stretchingRepository.save(stretching);

    return stretchingExercise;
  }

  public async update(id: string, dto: UpdateStretchingExerciseDto): Promise<StretchingExercise> {
    const stretchingExercise = await this.stretchingExerciseRepository.findOne({
      where: { id }
    });

    if (!stretchingExercise) {
      throw new NotFoundException("Stretching-exercises not found");
    }

    const updatedStretchingExercise = this.stretchingExerciseRepository.merge(stretchingExercise, {
      ...dto,
      exercise: dto.exerciseId
    });

    await this.stretchingExerciseRepository.save(updatedStretchingExercise);

    return updatedStretchingExercise;
  }

  public async delete(id: string): Promise<void> {
    const stretchingExercise = await this.stretchingExerciseRepository.findOne({
      where: { id }
    });

    if (!stretchingExercise) {
      throw new NotFoundException("Stretching-exercises not found");
    }

    await this.stretchingExerciseRepository.remove(stretchingExercise);
  }
}
