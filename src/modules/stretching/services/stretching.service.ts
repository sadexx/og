import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Audio } from "../../audio/schemas";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { AudioService } from "../../audio/services";
import { CreateStretchingDto, UpdateStretchingDto, StretchingExerciseIdsDto, StretchingIdsDto } from "../common/dto";
import { Stretching } from "../schemas";
import { StretchingExercise } from "../../stretching-exercise/schemas";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { ESortOrder } from "../../../common/enums";

export class StretchingService {
  private readonly stretchingRepository: Repository<Stretching>;
  private readonly stretchingExerciseRepository: Repository<StretchingExercise>;

  constructor(private readonly audioService = new AudioService()) {
    this.stretchingRepository = AppDataSource.getRepository(Stretching);
    this.stretchingExerciseRepository = AppDataSource.getRepository(StretchingExercise);
  }

  public async getAll(): Promise<Stretching[]> {
    const stretching = await this.stretchingRepository.find({
      relations: {
        startAudio: true,
        endAudio: true
      },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return stretching;
  }

  public async getById(id: string): Promise<Stretching | null> {
    const stretching = await this.stretchingRepository.findOne({
      where: { id },
      relations: {
        startAudio: true,
        endAudio: true
      }
    });

    if (!stretching) {
      throw new NotFoundException("Stretching not found");
    }

    return stretching;
  }

  public async getStretchingExercisesInStretching(id: string): Promise<StretchingExercise[]> {
    const workoutExercises = await this.stretchingExerciseRepository.find({
      where: { stretching: { id } },
      relations: {
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
      },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return workoutExercises;
  }

  public async create(dto: CreateStretchingDto): Promise<Stretching> {
    const { startText: AudioStartText, endText: AudioEndText, ...stretchingData } = dto;

    const startAudio: Audio = await this.audioService.create(AudioStartText, "stretches");

    const endAudio: Audio = await this.audioService.create(AudioEndText, "stretches");

    const stretching = this.stretchingRepository.create({
      startText: AudioStartText,
      endText: AudioEndText,
      startAudio,
      endAudio,
      ...stretchingData
    });
    const stretchers = await this.stretchingRepository.find();

    stretching.ordinalNumber = getNextOrdinalNumber(stretchers);
    await this.stretchingRepository.save(stretching);

    return stretching;
  }

  public async update(id: string, dto: UpdateStretchingDto): Promise<Stretching> {
    const stretching = await this.stretchingRepository.findOne({
      where: { id },
      relations: { startAudio: true, endAudio: true }
    });

    if (!stretching) {
      throw new NotFoundException("Stretching not found");
    }

    Object.assign(stretching, dto);

    if (dto.startText) {
      const startAudio: Audio = await this.audioService.update(stretching.startAudio.id, dto.startText, "stretches");
      stretching.startAudio = startAudio;
    }

    if (dto.endText) {
      const endAudio: Audio = await this.audioService.update(stretching.endAudio.id, dto.endText, "stretches");

      stretching.endAudio = endAudio;
    }

    const updatedStretching = await this.stretchingRepository.save(stretching);

    return updatedStretching;
  }

  public async updateStretchingExercisesOrder(id: string, dto: StretchingExerciseIdsDto): Promise<void> {
    if (!dto.stretchingExerciseIds || dto.stretchingExerciseIds.length === 0) {
      throw new BadRequestException("Stretching-Exercise ids are required");
    }

    const stretchingExercises = await this.stretchingExerciseRepository.find({
      where: { stretching: { id } }
    });

    const orderMap: Map<string, number> = new Map(dto.stretchingExerciseIds.map((id, index) => [id, index + 1]));

    stretchingExercises.forEach((exercise) => {
      const newOrder = orderMap.get(exercise.id);

      if (newOrder !== undefined) {
        exercise.ordinalNumber = newOrder;
      }
    });

    await this.stretchingExerciseRepository.save(stretchingExercises);
  }

  public async updateStretchersOrder(dto: StretchingIdsDto): Promise<void> {
    if (!dto.stretchingIds || dto.stretchingIds.length === 0) {
      throw new BadRequestException("Stretching ids are required");
    }

    const stretchers = await this.stretchingRepository.findBy({
      id: In(dto.stretchingIds)
    });

    const orderMap: Map<string, number> = new Map(dto.stretchingIds.map((id, index) => [id, index + 1]));

    stretchers.forEach((stretches) => {
      const newOrder = orderMap.get(stretches.id);

      if (newOrder !== undefined) {
        stretches.ordinalNumber = newOrder;
      }
    });

    await this.stretchingRepository.save(stretchers);
  }

  public async delete(id: string): Promise<void> {
    const stretching = await this.stretchingRepository.findOne({
      where: { id },
      relations: {
        startAudio: true,
        endAudio: true,
        exerciseOrder: true
      }
    });

    if (!stretching) {
      throw new NotFoundException("Stretching not found");
    }

    await this.audioService.delete(stretching.startAudio.id);

    await this.audioService.delete(stretching.endAudio.id);

    if (stretching.exerciseOrder.length > 0) {
      await this.stretchingExerciseRepository.remove(stretching.exerciseOrder);
    }

    await this.stretchingRepository.remove(stretching);
  }
}
