import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { CustomStretching, CustomStretchingExercise } from "../schemas";
import { CreateCustomStretchingDto, UpdateCustomStretchingDto } from "../common/dto";
import { User } from "../../users/schemas";
import { ESortOrder } from "../../../common/enums";

export class CustomStretchingService {
  private readonly customStretchingRepository: Repository<CustomStretching>;
  private readonly customStretchingExerciseRepository: Repository<CustomStretchingExercise>;

  constructor() {
    this.customStretchingRepository = AppDataSource.getRepository(CustomStretching);
    this.customStretchingExerciseRepository = AppDataSource.getRepository(CustomStretchingExercise);
  }

  public async getAll(userId: string): Promise<CustomStretching[]> {
    const customStretches = await this.customStretchingRepository.find({
      where: { user: { id: userId } },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return customStretches;
  }

  public async getById(id: string, userId: string): Promise<CustomStretching | null> {
    const customStretching = await this.customStretchingRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!customStretching) {
      throw new NotFoundException("Custom-stretching not found");
    }

    return customStretching;
  }

  public async getCustomStretchingExercisesInCustomStretches(
    id: string,
    userId: string
  ): Promise<CustomStretchingExercise[]> {
    const customStretchingExercises = await this.customStretchingExerciseRepository.find({
      where: { customStretching: { id, user: { id: userId } } },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    if (customStretchingExercises.length === 0) {
      throw new NotFoundException("Custom-stretching-exercise not found");
    }

    return customStretchingExercises;
  }

  public async create(userId: string, dto: CreateCustomStretchingDto): Promise<CustomStretching> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // TODO: Check if the user is premium, add after premium subscription is added

      const user = await transactionalEntityManager.findOne(User, {
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // if ( !user.userPremiumSubscription.isPremium) {
      //   throw new BadRequestException(
      //     "Please subscribe to premium to create Custom-stretches"
      //   );
      // }

      const { customExerciseOrder, ...customStretchingDataWithoutOrder } = dto;
      const customStretchingData = customStretchingDataWithoutOrder;

      const customStretching = transactionalEntityManager.create(CustomStretching, {
        user: { id: user.id },
        ...customStretchingData,
        customExerciseOrder: undefined
      });

      const savedCustomStretching = await transactionalEntityManager.save(customStretching);

      for (const customExerciseOrderDto of customExerciseOrder) {
        const customWorkoutExercise = transactionalEntityManager.create(CustomStretchingExercise, {
          customStretching,
          ...customExerciseOrderDto
        });
        await transactionalEntityManager.save(customWorkoutExercise);
      }

      return savedCustomStretching;
    });
  }

  public async update(id: string, userId: string, dto: UpdateCustomStretchingDto): Promise<CustomStretching> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // TODO: Check if the user is premium, add after premium subscription is added

      const user = await transactionalEntityManager.findOne(User, {
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // if (!user.userPremiumSubscription.isPremium) {
      //   throw new BadRequestException(
      //     "Please subscribe to premium to create Custom-stretches"
      //   );
      // }

      const customStretching = await transactionalEntityManager.findOne(CustomStretching, {
        where: { id, user: { id: userId } },
        relations: {
          customExerciseOrder: true
        }
      });

      if (!customStretching) {
        throw new NotFoundException("Custom Stretching not found");
      }

      const existingStretchingExercise = customStretching.customExerciseOrder;
      await transactionalEntityManager.remove(existingStretchingExercise);
      customStretching.customExerciseOrder = [];

      const { customExerciseOrder, ...customStretchingDataWithoutOrder } = dto;
      const customStretchingData = customStretchingDataWithoutOrder;

      transactionalEntityManager.merge(CustomStretching, customStretching, customStretchingData);

      await transactionalEntityManager.save(customStretching);

      for (const customExerciseOrderDto of customExerciseOrder) {
        const newExercise = transactionalEntityManager.create(CustomStretchingExercise, {
          customStretching: { id: customStretching.id },
          ...customExerciseOrderDto
        });
        await transactionalEntityManager.save(newExercise);
      }

      return customStretching;
    });
  }

  public async delete(id: string, userId: string): Promise<void> {
    const customStretching = await this.customStretchingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: {
        customExerciseOrder: true
      }
    });

    if (!customStretching) {
      throw new NotFoundException("Stretching not found");
    }

    await this.customStretchingRepository.remove(customStretching);
  }
}
