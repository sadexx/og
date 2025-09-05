import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { WorkoutCategory } from "../../workout-category/schemas";
import { redisClient } from "../../../common/configs/redis.config";
import { ActivityType } from "../../activity-type/schemas";
import { UserDataOutput } from "../common/outputs";
import { CustomExercise } from "../../custom-exercise/schemas";
import { DefaultAudio } from "../../default-audio/schemas";
import { Equipments } from "../../equipments/schemas";
import { FavoriteWorkout } from "../../favorite-workouts/schemas";
import { LowerBodyMovementType } from "../../lower-body-movement-type/schemas";
import { RollingPlan } from "../../rolling-plan/schemas";
import { Settings } from "../../settings/schemas";
import { StrainClass } from "../../strain-class/schemas";
import { CustomStretching } from "../../custom-stretching/schemas";
import { Video } from "../../video/schemas";
import { ESortOrder } from "../../../common/enums";

export class BatchEntityFetcherService {
  private readonly ENTITY_CACHE_KEY: string = "all-origins";
  private readonly ENTITY_CACHE_ONE_DAY_TTL: number = 86400;

  private readonly settingsRepository: Repository<Settings>;
  private readonly defaultAudioRepository: Repository<DefaultAudio>;
  private readonly strainClassRepository: Repository<StrainClass>;
  private readonly videoRepository: Repository<Video>;
  private readonly activityTypeRepository: Repository<ActivityType>;
  private readonly equipmentsRepository: Repository<Equipments>;
  private readonly lowerBodyMovementTypeRepository: Repository<LowerBodyMovementType>;
  private readonly workoutCategoryRepository: Repository<WorkoutCategory>;

  private readonly rollingPlanRepository: Repository<RollingPlan>;
  private readonly favoriteWorkoutRepository: Repository<FavoriteWorkout>;
  private readonly customExerciseRepository: Repository<CustomExercise>;
  private readonly customStretchingRepository: Repository<CustomStretching>;

  constructor() {
    this.settingsRepository = AppDataSource.getRepository(Settings);
    this.defaultAudioRepository = AppDataSource.getRepository(DefaultAudio);
    this.strainClassRepository = AppDataSource.getRepository(StrainClass);
    this.videoRepository = AppDataSource.getRepository(Video);
    this.activityTypeRepository = AppDataSource.getRepository(ActivityType);
    this.equipmentsRepository = AppDataSource.getRepository(Equipments);
    this.lowerBodyMovementTypeRepository = AppDataSource.getRepository(LowerBodyMovementType);
    this.workoutCategoryRepository = AppDataSource.getRepository(WorkoutCategory);

    this.rollingPlanRepository = AppDataSource.getRepository(RollingPlan);
    this.favoriteWorkoutRepository = AppDataSource.getRepository(FavoriteWorkout);
    this.customExerciseRepository = AppDataSource.getRepository(CustomExercise);
    this.customStretchingRepository = AppDataSource.getRepository(CustomStretching);
  }

  public async updateCache(): Promise<void> {
    await this.clearCache();
    const originsData = await this.getAllOrigins();
    await redisClient.set(this.ENTITY_CACHE_KEY, JSON.stringify(originsData), "EX", this.ENTITY_CACHE_ONE_DAY_TTL);
  }

  public async clearCache(): Promise<void> {
    await redisClient.del(this.ENTITY_CACHE_KEY);
  }

  public async getAllOrigins(): Promise<unknown> {
    const cachedData = await redisClient.get(this.ENTITY_CACHE_KEY);

    if (cachedData) {
      return JSON.parse(cachedData) as unknown;
    }

    const originsData = await this.poolAllOrigins();
    await redisClient.set(this.ENTITY_CACHE_KEY, JSON.stringify(originsData), "EX", this.ENTITY_CACHE_ONE_DAY_TTL);

    return originsData;
  }

  public async poolAllOrigins(): Promise<{
    settings: Settings;
    defaultAudio: DefaultAudio[];
    strainClasses: StrainClass[];
    video: Video[];
    activityTypes: ActivityType[];
    equipments: Equipments[];
    lowerBodyMovementTypes: LowerBodyMovementType[];
    workoutCategories: WorkoutCategory[];
  }> {
    const settings = await this.settingsRepository.find();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...settingsWithoutId } = settings[0];
    const defaultAudio = await this.defaultAudioRepository.find();
    const strainClasses = await this.strainClassRepository.find({
      relations: {
        achievementAudio: true
      }
    });
    const video = await this.videoRepository.find({
      order: { ordinalNumber: ESortOrder.ASC }
    });
    const activityTypes = await this.activityTypeRepository.find({
      relations: {
        titleAudio: true,
        shortTitleAudio: true,
        abbreviationAudio: true
      }
    });
    const equipments = await this.equipmentsRepository.find({
      relations: {
        titleAudio: true,
        setupAudio: true,
        adjustmentAudio: true,
        removalAudio: true
      }
    });
    const lowerBodyMovementTypes = await this.lowerBodyMovementTypeRepository.find({
      relations: {
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
      },
      order: { ordinalNumber: ESortOrder.ASC }
    });
    const workoutCategories = await this.workoutCategoryRepository.find({
      order: { ordinalNumber: ESortOrder.ASC },
      relations: {
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
      }
    });

    return {
      settings: settingsWithoutId as Settings,
      defaultAudio,
      strainClasses,
      video,
      activityTypes,
      equipments,
      lowerBodyMovementTypes,
      workoutCategories
    };
  }

  public async getUserData(userId: string): Promise<UserDataOutput> {
    const rollingPlan = await this.rollingPlanRepository.findOne({
      where: { user: { id: userId } }
    });

    const favoriteWorkouts = await this.favoriteWorkoutRepository.find({
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
      order: { workout: { duration: ESortOrder.ASC } }
    });

    const customExercises = await this.customExerciseRepository.find({
      where: { user: { id: userId } },
      order: { title: ESortOrder.ASC }
    });

    const customStretches = await this.customStretchingRepository.find({
      where: { user: { id: userId } },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    return {
      rollingPlan,
      favoriteWorkouts,
      customExercises,
      customStretches
    };
  }
}
