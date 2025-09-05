import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { TtsService } from "../../tts/services";
import { AwsS3Service } from "../../aws-s3/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { CreateDefaultAudioDto, UpdateDefaultAudioDto } from "../common/dto";
import { DefaultAudio } from "../schemas";

export class DefaultAudioService {
  private readonly defaultAudioRepository: Repository<DefaultAudio>;

  constructor(
    private readonly ttsService = new TtsService(),
    private readonly awsS3Service = new AwsS3Service(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.defaultAudioRepository = AppDataSource.getRepository(DefaultAudio);
  }

  public async getAll(): Promise<DefaultAudio[]> {
    const defaultAudio = await this.defaultAudioRepository.find();

    return defaultAudio;
  }

  public async getById(id: string): Promise<DefaultAudio | null> {
    const defaultAudio = await this.defaultAudioRepository.findOne({
      where: { id }
    });

    if (!defaultAudio) {
      throw new NotFoundException("Default Audio not found");
    }

    return defaultAudio;
  }

  public async create(dto: CreateDefaultAudioDto): Promise<DefaultAudio> {
    await this.ttsService.setText(dto.text);
    const audioStream = await this.ttsService.synthesize();
    const contentType = "audio/mp3";
    const extension = "mp3";
    const directory = "default-audio";

    const url = await this.awsS3Service.upload(audioStream, directory, contentType, extension);

    const defaultAudio = this.defaultAudioRepository.create({
      ...dto,
      url: url
    });
    await this.defaultAudioRepository.save(defaultAudio);
    await this.batchEntityFetcherService.updateCache();

    return defaultAudio;
  }

  public async update(id: string, dto: UpdateDefaultAudioDto): Promise<DefaultAudio> {
    const defaultAudio = await this.defaultAudioRepository.findOne({
      where: { id }
    });

    if (!defaultAudio) {
      throw new NotFoundException("Default Audio not found");
    }

    if (dto.text) {
      await this.ttsService.setText(dto.text);
      const audioStream = await this.ttsService.synthesize();
      const contentType = "audio/mp3";
      const extension = "mp3";
      const directory = "default-audio";

      const url = await this.awsS3Service.upload(audioStream, directory, contentType, extension, defaultAudio.url);
      defaultAudio.url = url;
    }

    const updatedAudio = this.defaultAudioRepository.merge(defaultAudio, dto);

    await this.defaultAudioRepository.save(updatedAudio);
    await this.batchEntityFetcherService.updateCache();

    return updatedAudio;
  }

  public async delete(id: string): Promise<void> {
    const defaultAudio = await this.defaultAudioRepository.findOne({
      where: { id }
    });

    if (!defaultAudio) {
      throw new NotFoundException("Default Audio not found");
    }

    await this.awsS3Service.delete(defaultAudio.url);
    await this.defaultAudioRepository.remove(defaultAudio);
    await this.batchEntityFetcherService.updateCache();
  }
}
