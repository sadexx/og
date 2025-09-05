import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { AwsS3Service } from "../../aws-s3/services";
import { GripFirmware } from "../../grip-firmware/schemas";
import { CreateGripTypeDto, UpdateGripTypeDto, GripTypeIdsDto } from "../common/dto";
import { GripType } from "../schemas";
import { getNextOrdinalNumber } from "../../../common/helpers";
import { ESortOrder } from "../../../common/enums";

export class GripTypeService {
  private readonly gripTypeRepository: Repository<GripType>;
  private readonly gripFirmwareRepository: Repository<GripFirmware>;

  constructor(private readonly awsS3Service = new AwsS3Service()) {
    this.gripTypeRepository = AppDataSource.getRepository(GripType);
    this.gripFirmwareRepository = AppDataSource.getRepository(GripFirmware);
  }

  public async getAll(): Promise<GripType[]> {
    const gripTypes = await this.gripTypeRepository.find({
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return gripTypes;
  }

  public async getById(id: string): Promise<GripType | null> {
    const gripType = await this.gripTypeRepository.findOne({
      where: { id }
    });

    if (!gripType) {
      throw new NotFoundException("Grip-type not found");
    }

    return gripType;
  }

  public async getAllGripFirmwaresInGripType(id: string): Promise<GripFirmware[]> {
    const gripType = await this.gripTypeRepository.findOne({
      where: { id },
      relations: { gripFirmwares: true }
    });

    if (!gripType) {
      throw new NotFoundException("Grip-type not found");
    }

    return gripType.gripFirmwares;
  }

  public async getLastVersionGripFirmwareInGripType(id: string): Promise<GripFirmware> {
    const gripType = await this.gripTypeRepository.findOne({
      where: { id },
      relations: { gripFirmwares: true },
      order: {
        gripFirmwares: { createdDate: ESortOrder.DESC }
      }
    });

    if (!gripType) {
      throw new NotFoundException("Grip-type not found");
    }

    const latestGripFirmwareVersion = gripType.gripFirmwares[0];

    return latestGripFirmwareVersion;
  }

  public async create(dto: CreateGripTypeDto): Promise<GripType> {
    const gripType = this.gripTypeRepository.create(dto);
    const gripTypes = await this.gripTypeRepository.find();

    gripType.ordinalNumber = getNextOrdinalNumber(gripTypes);
    await this.gripTypeRepository.save(gripType);

    return gripType;
  }

  public async update(id: string, dto: UpdateGripTypeDto): Promise<GripType> {
    const gripType = await this.gripTypeRepository.findOne({
      where: { id }
    });

    if (!gripType) {
      throw new NotFoundException("Grip-type not found");
    }

    const updatedGripType = this.gripTypeRepository.merge(gripType, dto);
    await this.gripTypeRepository.save(updatedGripType);

    return updatedGripType;
  }

  public async updateGripTypesOrder(dto: GripTypeIdsDto): Promise<void> {
    if (!dto.gripTypeIds || dto.gripTypeIds.length === 0) {
      throw new BadRequestException("Grip-type ids are required");
    }

    const gripTypes = await this.gripTypeRepository.findBy({
      id: In(dto.gripTypeIds)
    });

    const orderMap: Map<string, number> = new Map(dto.gripTypeIds.map((id, index) => [id, index + 1]));

    gripTypes.forEach((gripType) => {
      const newOrder = orderMap.get(gripType.id);

      if (newOrder !== undefined) {
        gripType.ordinalNumber = newOrder;
      }
    });

    await this.gripTypeRepository.save(gripTypes);
  }

  public async delete(id: string): Promise<void> {
    const gripType = await this.gripTypeRepository.findOne({
      where: { id },
      relations: { gripFirmwares: true }
    });

    if (!gripType) {
      throw new NotFoundException("Grip-type not found");
    }

    if (gripType.gripFirmwares.length > 0) {
      for (const gripFirmware of gripType.gripFirmwares) {
        await this.awsS3Service.delete(gripFirmware.fileUrl);
        await this.gripFirmwareRepository.remove(gripFirmware);
      }
    }

    await this.awsS3Service.delete(gripType.imageUrl);

    await this.gripTypeRepository.remove(gripType);
  }
}
