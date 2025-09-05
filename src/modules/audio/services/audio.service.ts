import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Audio } from "../schemas";
import { NotFoundException } from "../../../common/exceptions";
import { AwsS3Service } from "../../aws-s3/services";
import { TtsService } from "../../tts/services";

export class AudioService {
  private readonly audioRepository: Repository<Audio>;

  constructor(
    private readonly ttsService = new TtsService(),
    private readonly awsS3Service = new AwsS3Service()
  ) {
    this.audioRepository = AppDataSource.getRepository(Audio);
  }

  public async getAll(): Promise<Audio[]> {
    const audio = await this.audioRepository.find();

    return audio;
  }

  public async getById(id: string): Promise<Audio | null> {
    const audio = await this.audioRepository.findOne({
      where: { id }
    });

    if (!audio) {
      throw new NotFoundException("Audio not found");
    }

    return audio;
  }

  public async create(text: string, directory: string): Promise<Audio> {
    await this.ttsService.setText(text);
    const audioStream = await this.ttsService.synthesize();
    const contentType = "audio/mp3";
    const extension = "mp3";

    const url = await this.awsS3Service.upload(audioStream, directory, contentType, extension);

    const audio = this.audioRepository.create({ url: url, text });
    await this.audioRepository.save(audio);

    return audio;
  }

  public async update(id: string, text: string, directory: string): Promise<Audio> {
    const audio = await this.audioRepository.findOne({
      where: { id }
    });

    if (!audio) {
      throw new NotFoundException("Audio not found");
    }

    await this.ttsService.setText(text);
    const audioStream = await this.ttsService.synthesize();
    const contentType = "audio/mp3";
    const extension = "mp3";

    const url = await this.awsS3Service.upload(audioStream, directory, contentType, extension, audio.url);

    const updatedAudio = this.audioRepository.merge(audio, {
      url: url,
      text
    });
    await this.audioRepository.save(updatedAudio);

    return updatedAudio;
  }

  public async delete(id: string): Promise<void> {
    const audio = await this.audioRepository.findOne({
      where: { id }
    });

    if (!audio) {
      throw new NotFoundException("Audio not found");
    }

    await this.awsS3Service.delete(audio.url);
    await this.audioRepository.remove(audio);
  }

  public async deleteMany(ids: string[]): Promise<void> {
    const audios = await this.audioRepository.findBy({ id: In(ids) });

    await Promise.all(audios.map((audio) => this.awsS3Service.delete(audio.url)));

    await this.audioRepository.remove(audios);
  }
}
