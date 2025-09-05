import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { GetAllCustomExerciseDto, CreateCustomExerciseDto, UpdateCustomExerciseDto } from "../common/dto";
import { CustomExercise } from "../schemas";
import { User } from "../../users/schemas";
import { PaginationQueryOutput } from "../../../common/outputs";
import { ESortOrder } from "../../../common/enums";

export class CustomExerciseService {
  private readonly customExerciseRepository: Repository<CustomExercise>;
  private readonly usersRepository: Repository<User>;

  constructor() {
    this.customExerciseRepository = AppDataSource.getRepository(CustomExercise);
    this.usersRepository = AppDataSource.getRepository(User);
  }

  public async getAll(userId: string, dto: GetAllCustomExerciseDto): Promise<PaginationQueryOutput<CustomExercise>> {
    const [exercises, total] = await this.customExerciseRepository.findAndCount({
      where: {
        user: {
          id: userId
        }
      },
      order: {
        title: ESortOrder.ASC
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: exercises,
      pageNumber: dto.page,
      pageCount: totalPages
    };
  }

  public async create(userId: string, dto: CreateCustomExerciseDto): Promise<CustomExercise> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const exercise = this.customExerciseRepository.create({
      ...dto,
      user: user
    });

    await this.customExerciseRepository.save(exercise);

    return exercise;
  }

  public async update(id: string, userId: string, dto: UpdateCustomExerciseDto): Promise<CustomExercise> {
    const exercise = await this.customExerciseRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!exercise) {
      throw new NotFoundException("Custom-exercise not found");
    }

    Object.assign(exercise, dto);

    const updatedExercise = await this.customExerciseRepository.save(exercise);

    return updatedExercise;
  }

  public async delete(id: string, userId: string): Promise<void> {
    const exercise = await this.customExerciseRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!exercise) {
      throw new NotFoundException("Custom-exercise not found");
    }

    await this.customExerciseRepository.remove(exercise);
  }
}
