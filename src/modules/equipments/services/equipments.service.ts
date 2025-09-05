import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { Audio } from "../../audio/schemas";
import { NotFoundException } from "../../../common/exceptions";
import { AudioService } from "../../audio/services";
import { BatchEntityFetcherService } from "../../batch-entity-fetcher/services";
import { CreateEquipmentsDto, UpdateEquipmentsDto } from "../common/dto";
import { Equipments } from "../schemas";

export class EquipmentsService {
  private readonly equipmentsRepository: Repository<Equipments>;

  constructor(
    private readonly audioService = new AudioService(),
    private readonly batchEntityFetcherService = new BatchEntityFetcherService()
  ) {
    this.equipmentsRepository = AppDataSource.getRepository(Equipments);
  }

  public async getAll(): Promise<Equipments[]> {
    const equipments = await this.equipmentsRepository.find({
      relations: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      }
    });

    return equipments;
  }

  public async getById(id: string): Promise<Equipments | null> {
    const equipments = await this.equipmentsRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      }
    });

    if (!equipments) {
      throw new NotFoundException("Equipments not found");
    }

    return equipments;
  }

  public async create(dto: CreateEquipmentsDto): Promise<Equipments> {
    const { title, setupAudioText, adjustmentAudioText, removalAudioText } = dto;

    const titleAudio: Audio = await this.audioService.create(title, "equipments/audio");

    const setupAudio: Audio = await this.audioService.create(setupAudioText, "equipments/audio");

    const adjustmentAudio: Audio = await this.audioService.create(adjustmentAudioText, "equipments/audio");

    const removalAudio: Audio = await this.audioService.create(removalAudioText, "equipments/audio");

    const equipments = this.equipmentsRepository.create(dto);
    equipments.titleAudio = titleAudio;
    equipments.setupAudio = setupAudio;
    equipments.adjustmentAudio = adjustmentAudio;
    equipments.removalAudio = removalAudio;
    await this.equipmentsRepository.save(equipments);
    await this.batchEntityFetcherService.updateCache();

    return equipments;
  }

  public async update(id: string, dto: UpdateEquipmentsDto): Promise<Equipments> {
    const equipments = await this.equipmentsRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      }
    });

    if (!equipments) {
      throw new NotFoundException("Equipments not found");
    }

    if (dto.title) {
      const titleAudio = await this.audioService.update(equipments.titleAudio.id, dto.title, "equipments/audio");
      equipments.titleAudio = titleAudio;
    }

    if (dto.setupAudioText && equipments.setupAudio) {
      const setupAudio = await this.audioService.update(
        equipments.setupAudio.id,
        dto.setupAudioText,
        "equipments/audio"
      );
      equipments.setupAudio = setupAudio;
    }

    if (dto.setupAudioText && !equipments.setupAudio) {
      const setupAudio = await this.audioService.create(dto.setupAudioText, "equipments/audio");
      equipments.setupAudio = setupAudio;
    }

    if (dto.adjustmentAudioText && equipments.adjustmentAudio) {
      const adjustmentAudio = await this.audioService.update(
        equipments.adjustmentAudio.id,
        dto.adjustmentAudioText,
        "equipments/audio"
      );
      equipments.adjustmentAudio = adjustmentAudio;
    }

    if (dto.adjustmentAudioText && !equipments.adjustmentAudio) {
      const adjustmentAudio = await this.audioService.create(dto.adjustmentAudioText, "equipments/audio");
      equipments.adjustmentAudio = adjustmentAudio;
    }

    if (dto.removalAudioText && equipments.removalAudio) {
      const removalAudio = await this.audioService.update(
        equipments.removalAudio.id,
        dto.removalAudioText,
        "equipments/audio"
      );
      equipments.removalAudio = removalAudio;
    }

    if (dto.removalAudioText && !equipments.removalAudio) {
      const removalAudio = await this.audioService.create(dto.removalAudioText, "equipments/audio");
      equipments.removalAudio = removalAudio;
    }

    const updatedEquipments = this.equipmentsRepository.merge(equipments, dto);
    await this.equipmentsRepository.save(updatedEquipments);
    await this.batchEntityFetcherService.updateCache();

    return updatedEquipments;
  }

  public async delete(id: string): Promise<void> {
    const equipments = await this.equipmentsRepository.findOne({
      where: { id },
      relations: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      }
    });

    if (!equipments) {
      throw new NotFoundException("Equipments not found");
    }

    await this.audioService.delete(equipments.titleAudio.id);

    if (equipments.setupAudio) {
      await this.audioService.delete(equipments.setupAudio.id);
    }

    if (equipments.adjustmentAudio) {
      await this.audioService.delete(equipments.adjustmentAudio.id);
    }

    if (equipments.removalAudio) {
      await this.audioService.delete(equipments.removalAudio.id);
    }

    await this.equipmentsRepository.remove(equipments);
    await this.batchEntityFetcherService.updateCache();
  }
}
