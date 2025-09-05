import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Audio } from "../../audio/schemas";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { CreateActivityTypeDto, UpdateActivityTypeDto } from "../common/dto";
import { ActivityType } from "../schemas";
import { AudioService } from "../../audio/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";

export class ActivityTypeService {
  private readonly activityTypeRepository: Repository<ActivityType>;

  constructor(
    private readonly audioService = new AudioService(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.activityTypeRepository = AppDataSource.getRepository(ActivityType);
  }

  public async getAll(): Promise<ActivityType[]> {
    const activityType = await this.activityTypeRepository.find({
      relations: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true
      }
    });

    return activityType;
  }

  public async getById(id: string): Promise<ActivityType | null> {
    const activityType = await this.activityTypeRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true
      }
    });

    if (!activityType) {
      throw new NotFoundException("Activity type not found");
    }

    return activityType;
  }

  public async create(dto: CreateActivityTypeDto): Promise<ActivityType> {
    const { title, shortTitle, abbreviation } = dto;

    const titleAudio: Audio = await this.audioService.create(title, "activity-types/audio");

    let shortTitleAudio: Audio | null = null;

    if (shortTitle) {
      shortTitleAudio = await this.audioService.create(shortTitle, "activity-types/audio");
    }

    const abbreviationAudio: Audio = await this.audioService.create(abbreviation, "activity-types/audio");

    const activityType = this.activityTypeRepository.create(dto);
    activityType.titleAudio = titleAudio;
    activityType.shortTitleAudio = shortTitleAudio;
    activityType.abbreviationAudio = abbreviationAudio;

    await this.activityTypeRepository.save(activityType);
    await this.batchEntityFetcherService.updateCache();

    return activityType;
  }

  public async update(id: string, dto: UpdateActivityTypeDto): Promise<ActivityType> {
    const activityType = await this.activityTypeRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true
      }
    });

    if (!activityType) {
      throw new NotFoundException("Activity type not found");
    }

    if (dto.title && activityType.titleAudio) {
      const titleAudio = await this.audioService.update(activityType.titleAudio.id, dto.title, "activity-types/audio");
      activityType.titleAudio = titleAudio;
    }

    if (dto.title && !activityType.titleAudio) {
      const titleAudio = await this.audioService.create(dto.title, "activity-types/audio");
      activityType.titleAudio = titleAudio;
    }

    if (dto.shortTitle && dto.shortTitle !== null && activityType.shortTitleAudio) {
      const shortTitleAudio = await this.audioService.update(
        activityType.shortTitleAudio.id,
        dto.shortTitle,
        "activity-types/audio"
      );
      activityType.shortTitleAudio = shortTitleAudio;
    }

    if (dto.shortTitle && !activityType.shortTitleAudio) {
      const shortTitleAudio = await this.audioService.create(dto.shortTitle, "activity-types/audio");
      activityType.shortTitleAudio = shortTitleAudio;
    }

    if (dto.shortTitle === null && activityType.shortTitleAudio) {
      await this.activityTypeRepository.update({ id: activityType.id }, { shortTitleAudio: null });
      await this.audioService.delete(activityType.shortTitleAudio.id);
      activityType.shortTitleAudio = null;
    }

    if (dto.abbreviation && activityType.abbreviationAudio) {
      const abbreviationAudio = await this.audioService.update(
        activityType.abbreviationAudio.id,
        dto.abbreviation,
        "activity-types/audio"
      );
      activityType.abbreviationAudio = abbreviationAudio;
    }

    if (dto.abbreviation && !activityType.abbreviationAudio) {
      const abbreviationAudio = await this.audioService.create(dto.abbreviation, "activity-types/audio");
      activityType.abbreviationAudio = abbreviationAudio;
    }

    const updatedActivityType = this.activityTypeRepository.merge(activityType, dto);
    await this.activityTypeRepository.save(updatedActivityType);
    await this.batchEntityFetcherService.updateCache();

    return updatedActivityType;
  }

  public async delete(id: string): Promise<void> {
    const activityType = await this.activityTypeRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true,
        exercises: true
      }
    });

    if (!activityType) {
      throw new NotFoundException("Activity type not found");
    }

    if (activityType.exercises && activityType.exercises.length > 0) {
      throw new BadRequestException("Cannot delete a activity type associated with an exercise");
    }

    await this.audioService.delete(activityType.titleAudio.id);

    if (activityType.shortTitleAudio) {
      await this.audioService.delete(activityType.shortTitleAudio.id);
    }

    await this.audioService.delete(activityType.abbreviationAudio.id);

    await this.activityTypeRepository.remove(activityType);
    await this.batchEntityFetcherService.updateCache();
  }
}
