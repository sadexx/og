import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException, BadRequestException } from "../../../common/exceptions";
import { CreateGripFirmwareDto, UpdateGripFirmwareDto } from "../common/dto";
import { GripFirmware } from "../schemas";
import { AwsS3Service } from "../../aws-s3/services";
import { GripType } from "../../grip-types/schemas";

export class GripFirmwareService {
  private readonly gripFirmwareRepository: Repository<GripFirmware>;
  private readonly gripTypeRepository: Repository<GripType>;

  constructor(private readonly awsS3Service = new AwsS3Service()) {
    this.gripFirmwareRepository = AppDataSource.getRepository(GripFirmware);
    this.gripTypeRepository = AppDataSource.getRepository(GripType);
  }

  public async getById(id: string): Promise<GripFirmware | null> {
    const gripFirmware = await this.gripFirmwareRepository.findOne({
      where: { id }
    });

    if (!gripFirmware) {
      throw new NotFoundException("Grip-firmware not found");
    }

    return gripFirmware;
  }

  public async create(dto: CreateGripFirmwareDto): Promise<GripFirmware> {
    const VERSION_LIMIT = 3;
    const gripType = await this.gripTypeRepository.findOne({
      where: { id: dto.gripTypeId as unknown as string },
      relations: { gripFirmwares: true }
    });

    if (!gripType) {
      throw new NotFoundException("Grip-type not found");
    }

    if (gripType.gripFirmwares.length >= VERSION_LIMIT) {
      throw new BadRequestException(
        "Grip-type already has 3 versions firmwares. To avoid conflicts, one of the versions must be removed."
      );
    }

    const gripFirmware = this.gripFirmwareRepository.create({
      gripType: dto.gripTypeId,
      ...dto
    });

    await this.gripFirmwareRepository.save(gripFirmware);

    return gripFirmware;
  }

  public async update(id: string, dto: UpdateGripFirmwareDto): Promise<GripFirmware> {
    const gripFirmware = await this.gripFirmwareRepository.findOne({
      where: { id }
    });

    if (!gripFirmware) {
      throw new NotFoundException("Grip-firmware not found");
    }

    const updatedGripFirmware = this.gripFirmwareRepository.merge(gripFirmware, dto);
    await this.gripFirmwareRepository.save(updatedGripFirmware);

    return updatedGripFirmware;
  }

  public async delete(id: string): Promise<void> {
    const gripFirmware = await this.gripFirmwareRepository.findOne({
      where: { id }
    });

    if (!gripFirmware) {
      throw new NotFoundException("Grip-firmware not found");
    }

    await this.awsS3Service.delete(gripFirmware.fileUrl);

    await this.gripFirmwareRepository.remove(gripFirmware);
  }
}
