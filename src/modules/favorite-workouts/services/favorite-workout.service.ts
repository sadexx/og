import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { PaginationQueryOutput } from "../../../common/outputs";
import { CustomWorkout, CustomWorkoutExercise } from "../../custom-workout/schemas";
import { CustomWorkoutSettings } from "../../custom-workout-settings/schemas";
import { GetAllFavoriteWorkoutQueryDto, CreateFavoriteWorkoutDto, UpdateFavoriteWorkoutDto } from "../common/dto";
import { FavoriteWorkout } from "../schemas";
import { User } from "../../users/schemas";
import { FavoriteWorkoutOutput } from "../common/outputs";
import { ESortOrder } from "../../../common/enums";

export class FavoriteWorkoutService {
  private readonly favoriteWorkoutRepository: Repository<FavoriteWorkout>;
  private readonly userRepository: Repository<User>;

  constructor() {
    this.favoriteWorkoutRepository = AppDataSource.getRepository(FavoriteWorkout);
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async getAll(
    userId: string,
    dto: GetAllFavoriteWorkoutQueryDto
  ): Promise<PaginationQueryOutput<FavoriteWorkout>> {
    const [favoriteWorkouts, total] = await this.favoriteWorkoutRepository.findAndCount({
      where: { user: { id: userId } },
      relations: {
        workout: {
          workoutCategory: {
            focalBodyParts: true,
            defaultLowerBodyMovementType: {
              exercise: {
                preparationGuideVideo: true,
                generalSafetyVideo: true,
                activityType: {
                  titleAudio: true,
                  shortTitleAudio: true,
                  abbreviationAudio: true
                },
                equipments: {
                  titleAudio: true,
                  setupAudio: true,
                  adjustmentAudio: true,
                  removalAudio: true
                },
                titleAudio: true,
                manualAudio: true
              }
            }
          },
          focalBodyPart: true
        },
        customWorkout: { customExerciseOrder: true },
        customWorkoutSettings: true
      },
      order: { workout: { duration: ESortOrder.ASC } },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: favoriteWorkouts,
      pageNumber: dto.page,
      pageCount: totalPages
    };
  }

  public async getById(userId: string, id: string): Promise<FavoriteWorkout | null> {
    const favoriteWorkout = await this.favoriteWorkoutRepository.findOne({
      where: { id, user: { id: userId } },
      relations: {
        workout: {
          workoutCategory: {
            focalBodyParts: true,
            defaultLowerBodyMovementType: {
              exercise: {
                preparationGuideVideo: true,
                generalSafetyVideo: true,
                activityType: {
                  titleAudio: true,
                  shortTitleAudio: true,
                  abbreviationAudio: true
                },
                equipments: {
                  titleAudio: true,
                  setupAudio: true,
                  adjustmentAudio: true,
                  removalAudio: true
                },
                titleAudio: true,
                manualAudio: true
              }
            }
          },
          focalBodyPart: true
        },
        customWorkout: true,
        customWorkoutSettings: true
      }
    });

    if (!favoriteWorkout) {
      throw new NotFoundException("Favorite-workout not found");
    }

    return favoriteWorkout;
  }

  public async create(userId: string, dto: CreateFavoriteWorkoutDto): Promise<FavoriteWorkoutOutput> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      if (dto.customWorkout && dto.workoutOriginalId) {
        throw new BadRequestException("Custom-workout and Original-workout cannot be provided at the same time");
      }

      // TODO: Check if the user is premium, add after premium subscription is added

      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // if ((dto.customWorkout || dto.customWorkoutSettings) && !user.userPremiumSubscription.isPremium) {
      //   throw new BadRequestException(
      //     "Please subscribe to premium to create Custom-favorite-workout or Custom-workout-settings"
      //   );
      // }

      let customWorkoutResponse: { id: string } | null = null;
      let customWorkoutSettingsResponse: { id: string } | null = null;

      const favoriteWorkout = transactionalEntityManager.create(FavoriteWorkout, {
        user: { id: user.id },
        workout: { id: dto.workoutOriginalId },
        customFavoriteWorkoutOnPhoneId: dto.customFavoriteWorkoutOnPhoneId
      });
      await transactionalEntityManager.save(favoriteWorkout);

      if (dto.customWorkoutSettings) {
        const settings = transactionalEntityManager.create(CustomWorkoutSettings, {
          ...dto.customWorkoutSettings,
          favoriteWorkout
        });
        const savedSettings = await transactionalEntityManager.save(settings);
        customWorkoutSettingsResponse = { id: savedSettings.id };
      }

      if (dto.customWorkout) {
        const { customExerciseOrder, ...customWorkoutDataWithoutOrder } = dto.customWorkout;
        const customWorkoutData = customWorkoutDataWithoutOrder;

        const customWorkout = transactionalEntityManager.create(CustomWorkout, {
          favoriteWorkout,
          ...customWorkoutData
        });

        const savedCustomWorkout = await transactionalEntityManager.save(customWorkout);
        customWorkoutResponse = { id: savedCustomWorkout.id };

        for (const customExerciseOrderDto of customExerciseOrder) {
          const customWorkoutExercise = transactionalEntityManager.create(CustomWorkoutExercise, {
            customWorkout,
            ...customExerciseOrderDto
          });
          await transactionalEntityManager.save(customWorkoutExercise);
        }
      }

      const savedFavoriteWorkout = await transactionalEntityManager.save(favoriteWorkout);

      const responseObject: FavoriteWorkoutOutput = {
        id: savedFavoriteWorkout.id,
        customFavoriteWorkoutOnPhoneId: savedFavoriteWorkout.customFavoriteWorkoutOnPhoneId,
        workout: dto.workoutOriginalId ? { id: dto.workoutOriginalId } : null,
        customWorkout: customWorkoutResponse,
        customWorkoutSettings: customWorkoutSettingsResponse,
        createdDate: savedFavoriteWorkout.createdDate,
        updatedDate: savedFavoriteWorkout.updatedDate
      };

      return responseObject;
    });
  }

  public async update(userId: string, id: string, dto: UpdateFavoriteWorkoutDto): Promise<FavoriteWorkoutOutput> {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      const favoriteWorkout = await this.favoriteWorkoutRepository.findOne({
        where: { id, user: { id: userId } },
        relations: {
          workout: true,
          customWorkout: { customExerciseOrder: true },
          customWorkoutSettings: true
        }
      });

      if (!favoriteWorkout) {
        throw new NotFoundException("Favorite-workout or Custom-workout not found");
      }

      // TODO: Check if the user is premium, add after premium subscription is added
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // if ((dto.customWorkout || dto.customWorkoutSettings) && !user.userPremiumSubscription.isPremium) {
      //   throw new BadRequestException(
      //     "Please subscribe to premium to create Custom-favorite-workout or Custom-favorite-workout-settings"
      //   );
      // }

      let customWorkoutSettingsResponse: { id: string } | null = null;
      let customWorkoutResponse: { id: string } | null = null;

      if (dto.customWorkout) {
        if (favoriteWorkout.customWorkout) {
          const { customExerciseOrder, ...customWorkoutWithoutExerciseOrder } = dto.customWorkout;

          const existingExercises = favoriteWorkout.customWorkout.customExerciseOrder;

          transactionalEntityManager.merge(
            CustomWorkout,
            favoriteWorkout.customWorkout,
            customWorkoutWithoutExerciseOrder
          );

          const savedCustomWorkout = await transactionalEntityManager.save(favoriteWorkout.customWorkout);

          await transactionalEntityManager.remove(existingExercises);

          customWorkoutResponse = {
            id: (savedCustomWorkout as CustomWorkout).id
          };

          favoriteWorkout.customWorkout.customExerciseOrder = [];

          for (const customExerciseOrderDto of customExerciseOrder) {
            const newExercise = transactionalEntityManager.create(CustomWorkoutExercise, {
              ...customExerciseOrderDto,
              customWorkout: favoriteWorkout.customWorkout
            });

            await transactionalEntityManager.save(newExercise);
          }
        }

        if (!favoriteWorkout.customWorkout && favoriteWorkout.workout) {
          favoriteWorkout.workout = null;
          await transactionalEntityManager.update(FavoriteWorkout, favoriteWorkout.id, {
            workout: null
          });

          const { customExerciseOrder, ...customWorkoutWithoutExerciseOrder } = dto.customWorkout;

          const customWorkout = transactionalEntityManager.create(CustomWorkout, {
            favoriteWorkout,
            ...customWorkoutWithoutExerciseOrder
          });

          const savedCustomWorkout = await transactionalEntityManager.save(customWorkout);
          customWorkoutResponse = { id: savedCustomWorkout.id };

          for (const customExerciseOrderDto of customExerciseOrder) {
            const customWorkoutExercise = transactionalEntityManager.create(CustomWorkoutExercise, {
              customWorkout: savedCustomWorkout,
              ...customExerciseOrderDto
            });

            await transactionalEntityManager.save(customWorkoutExercise);
          }
        }
      }

      if (dto.customWorkoutSettings) {
        if (favoriteWorkout.customWorkoutSettings) {
          const customSettings = transactionalEntityManager.merge(
            CustomWorkoutSettings,
            favoriteWorkout.customWorkoutSettings,
            dto.customWorkoutSettings
          );

          const savedSettings = await transactionalEntityManager.save(customSettings);
          customWorkoutSettingsResponse = {
            id: (savedSettings as CustomWorkoutSettings).id
          };
        }

        if (!favoriteWorkout.customWorkoutSettings) {
          const settings = transactionalEntityManager.create(CustomWorkoutSettings, {
            ...dto.customWorkoutSettings,
            favoriteWorkout
          });
          const savedSettings = await transactionalEntityManager.save(settings);
          customWorkoutSettingsResponse = { id: savedSettings.id };
        }
      }

      const responseObject: FavoriteWorkoutOutput = {
        id: favoriteWorkout.id,
        customFavoriteWorkoutOnPhoneId: favoriteWorkout.customFavoriteWorkoutOnPhoneId,
        workout: favoriteWorkout.workout?.id ? { id: favoriteWorkout.workout?.id } : null,
        customWorkout: customWorkoutResponse,
        customWorkoutSettings: favoriteWorkout.customWorkoutSettings ? customWorkoutSettingsResponse : null,
        createdDate: favoriteWorkout.createdDate,
        updatedDate: favoriteWorkout.updatedDate
      };

      return responseObject;
    });
  }

  public async delete(userId: string, id: string): Promise<void> {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const favoriteWorkout = await transactionalEntityManager.findOne(FavoriteWorkout, {
        where: { id, user: { id: userId } },
        relations: {
          customWorkoutSettings: true,
          customWorkout: {
            customExerciseOrder: true
          }
        }
      });

      if (!favoriteWorkout) {
        throw new NotFoundException("Favorite-workout not found");
      }

      if (favoriteWorkout.customWorkout !== null) {
        await transactionalEntityManager.remove(favoriteWorkout.customWorkout.customExerciseOrder);

        await transactionalEntityManager.remove(favoriteWorkout.customWorkout);
      }

      if (favoriteWorkout.customWorkoutSettings) {
        await transactionalEntityManager.remove(favoriteWorkout.customWorkoutSettings);
      }

      await transactionalEntityManager.remove(favoriteWorkout);
    });
  }
}
