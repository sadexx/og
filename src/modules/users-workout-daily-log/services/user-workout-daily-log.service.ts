import { Between, FindOptionsWhere, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { GetAllUsersWorkoutDailyLogDto } from "../common/dto";
import { UserWorkoutDailyLog } from "../schemas";

export class UserWorkoutDailyLogService {
  private readonly workoutDailyLogRepository: Repository<UserWorkoutDailyLog>;

  constructor() {
    this.workoutDailyLogRepository = AppDataSource.getRepository(UserWorkoutDailyLog);
  }

  public async getAll(userId: string, dto: GetAllUsersWorkoutDailyLogDto): Promise<UserWorkoutDailyLog[]> {
    const whereCondition: FindOptionsWhere<UserWorkoutDailyLog> = {
      userDailyReport: {
        user: {
          id: userId
        }
      },
      createdDate: Between(dto.startDate, dto.endDate)
    };

    if (dto.workoutOriginalId) {
      whereCondition.workoutOriginalId = dto.workoutOriginalId;
    }

    const userWorkoutDailyLogs = await this.workoutDailyLogRepository.find({
      where: whereCondition
    });

    return userWorkoutDailyLogs;
  }

  public async getAllUniqueTitle(userId: string): Promise<UserWorkoutDailyLog[]> {
    const userWorkoutDailyLogs = await this.workoutDailyLogRepository
      .createQueryBuilder("log")
      .distinctOn(["log.workoutOriginalId"])
      .leftJoin("log.userDailyReport", "udr")
      .leftJoin("udr.user", "u")
      .where("u.id = :userId", { userId })
      .orderBy("log.workoutOriginalId", "ASC")
      .addOrderBy("log.id", "ASC")
      .getMany();

    return userWorkoutDailyLogs;
  }

  public async getById(id: string): Promise<UserWorkoutDailyLog | null> {
    const workoutDailyLog = await this.workoutDailyLogRepository.findOne({
      where: { id },
      relations: {
        userExerciseDetailLogs: true
      }
    });

    if (!workoutDailyLog) {
      throw new NotFoundException("Workout-Daily-Log not found");
    }

    return workoutDailyLog;
  }
}
