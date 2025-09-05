import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { FocalBodyPart } from "../schemas";
import { CreateFocalBodyPartDto, UpdateFocalBodyPartDto } from "../common/dto";

export class FocalBodyPartService {
  private readonly focalBodyPartRepository: Repository<FocalBodyPart>;
  constructor() {
    this.focalBodyPartRepository = AppDataSource.getRepository(FocalBodyPart);
  }

  public async getAll(): Promise<FocalBodyPart[]> {
    const focalBodyParts = await this.focalBodyPartRepository.find();

    return focalBodyParts;
  }

  public async getById(id: string): Promise<FocalBodyPart | null> {
    const focalBodyPart = await this.focalBodyPartRepository.findOne({
      where: { id }
    });

    if (!focalBodyPart) {
      throw new NotFoundException("Focal-body-part not found");
    }

    return focalBodyPart;
  }

  public async create(dto: CreateFocalBodyPartDto): Promise<FocalBodyPart> {
    const focalBodyPart = this.focalBodyPartRepository.create(dto);

    await this.focalBodyPartRepository.save(focalBodyPart);

    return focalBodyPart;
  }

  public async update(id: string, dto: UpdateFocalBodyPartDto): Promise<FocalBodyPart> {
    const focalBodyPart = await this.focalBodyPartRepository.findOne({
      where: { id }
    });

    if (!focalBodyPart) {
      throw new NotFoundException("Focal-body-part not found");
    }

    const updatedWorkoutCategory = this.focalBodyPartRepository.merge(focalBodyPart, dto);
    await this.focalBodyPartRepository.save(updatedWorkoutCategory);

    return updatedWorkoutCategory;
  }

  public async delete(id: string): Promise<void> {
    const focalBodyPart = await this.focalBodyPartRepository.findOne({
      where: { id },
      relations: {
        workouts: true,
        workoutCategories: true
      }
    });

    if (!focalBodyPart) {
      throw new NotFoundException("Focal-body-part not found");
    }

    if (
      (focalBodyPart.workouts && focalBodyPart.workouts.length > 0) ||
      (focalBodyPart.workoutCategories && focalBodyPart.workoutCategories.length > 0)
    ) {
      throw new BadRequestException("Cannot delete a Focal-body-part associated with an workout or workout-category");
    }

    await this.focalBodyPartRepository.remove(focalBodyPart);
  }
}
