import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { CreateVideoDto, UpdateVideoDto, VideoIdsDto } from "../common/dto";
import { NotFoundException, BadRequestException } from "../../../common/exceptions";
import { AwsS3Service } from "../../aws-s3/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { Video } from "../schemas";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { ESortOrder } from "../../../common/enums";

export class VideoService {
  private readonly videoRepository: Repository<Video>;

  constructor(
    private readonly awsS3Service = new AwsS3Service(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.videoRepository = AppDataSource.getRepository(Video);
  }

  public async getAll(): Promise<Video[]> {
    const video = await this.videoRepository.find({
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return video;
  }

  public async getById(id: string): Promise<Video | null> {
    const video = await this.videoRepository.findOne({
      where: { id }
    });

    if (!video) {
      throw new NotFoundException("Video not found");
    }

    return video;
  }

  public async create(dto: CreateVideoDto): Promise<Video> {
    const video = this.videoRepository.create(dto);
    const videos = await this.videoRepository.find();

    video.ordinalNumber = getNextOrdinalNumber(videos);
    await this.videoRepository.save(video);
    await this.batchEntityFetcherService.updateCache();

    return video;
  }

  public async update(id: string, dto: UpdateVideoDto): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id }
    });

    if (!video) {
      throw new NotFoundException("Video not found");
    }

    const updatedVideo = this.videoRepository.merge(video, dto);
    await this.videoRepository.save(updatedVideo);
    await this.batchEntityFetcherService.updateCache();

    return updatedVideo;
  }

  public async updateVideoOrder(dto: VideoIdsDto): Promise<void> {
    if (!dto.videoIds || dto.videoIds.length === 0) {
      throw new BadRequestException("Video ids are required");
    }

    const videos = await this.videoRepository.findBy({
      id: In(dto.videoIds)
    });

    const orderMap: Map<string, number> = new Map(dto.videoIds.map((id, index) => [id, index + 1]));

    videos.forEach((videos) => {
      const newOrder = orderMap.get(videos.id);

      if (newOrder !== undefined) {
        videos.ordinalNumber = newOrder;
      }
    });

    await this.videoRepository.save(videos);
  }

  public async delete(id: string): Promise<void> {
    const video = await this.videoRepository.findOne({
      where: { id }
    });

    if (!video) {
      throw new NotFoundException("Video not found");
    }

    await this.awsS3Service.delete(video.url);
    await this.videoRepository.remove(video);
    await this.batchEntityFetcherService.updateCache();
  }
}
