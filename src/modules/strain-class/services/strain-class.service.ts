import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Audio } from "../../audio/schemas";
import { NotFoundException } from "../../../common/exceptions";
import { AwsS3Service } from "../../aws-s3/services";
import { AudioService } from "../../audio/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { CreateStrainClassDto, UpdateStrainClassDto } from "../common/dto";
import { StrainClass } from "../schemas";

export class StrainClassService {
  private readonly strainClassRepository: Repository<StrainClass>;

  constructor(
    private readonly awsS3Service = new AwsS3Service(),
    private readonly audioService = new AudioService(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.strainClassRepository = AppDataSource.getRepository(StrainClass);
  }

  public async getAll(): Promise<StrainClass[]> {
    const strainClasses = await this.strainClassRepository.find({
      relations: {
        achievementAudio: true
      }
    });

    return strainClasses;
  }

  public async getById(id: string): Promise<StrainClass | null> {
    const strainClass = await this.strainClassRepository.findOne({
      where: { id },
      relations: {
        achievementAudio: true
      }
    });

    if (!strainClass) {
      throw new NotFoundException("Strain-class not found");
    }

    return strainClass;
  }

  public async create(dto: CreateStrainClassDto): Promise<StrainClass> {
    const strainClass = this.strainClassRepository.create(dto);

    const achievementAudio: Audio = await this.audioService.create(dto.achievementAudioText, "strain-classes/audio");

    strainClass.achievementAudio = achievementAudio;

    const savedStrainClass = await this.strainClassRepository.save(strainClass);
    await this.batchEntityFetcherService.updateCache();

    return savedStrainClass;
  }

  public async update(id: string, dto: UpdateStrainClassDto): Promise<StrainClass> {
    const strainClass = await this.strainClassRepository.findOne({
      where: { id },
      relations: {
        achievementAudio: true
      }
    });

    if (!strainClass) {
      throw new NotFoundException("Strain-class not found");
    }

    if (dto.achievementAudioText) {
      if (!strainClass.achievementAudio) {
        const achievementAudio: Audio = await this.audioService.create(
          dto.achievementAudioText,
          "strain-classes/audio"
        );
        strainClass.achievementAudio = achievementAudio;
      }

      if (strainClass.achievementAudio) {
        const achievementAudio = await this.audioService.update(
          strainClass.achievementAudio.id,
          dto.achievementAudioText,
          "strain-classes/audio"
        );
        strainClass.achievementAudio = achievementAudio;
      }
    }

    const updatedStrainClass = this.strainClassRepository.merge(strainClass, dto);
    await this.strainClassRepository.save(updatedStrainClass);
    await this.batchEntityFetcherService.updateCache();

    return updatedStrainClass;
  }

  public async delete(id: string): Promise<void> {
    const strainClass = await this.strainClassRepository.findOne({
      where: { id },
      relations: {
        achievementAudio: true
      }
    });

    if (!strainClass) {
      throw new NotFoundException("Strain-class not found");
    }

    if (strainClass.imageUrl) {
      await this.awsS3Service.delete(strainClass.imageUrl);
    }

    await this.audioService.delete(strainClass.achievementAudio.id);
    await this.strainClassRepository.remove(strainClass);
    await this.batchEntityFetcherService.updateCache();
  }
}
