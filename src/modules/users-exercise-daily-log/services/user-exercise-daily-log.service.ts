import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException, UnauthorizedException } from "../../../common/exceptions";
import { UserExerciseDailyLog } from "../schemas";
import { UserWorkoutDailyLog } from "../../users-workout-daily-log/schemas";
import { ESortOrder } from "../../../common/enums";

export class UserExerciseDailyLogService {
  private readonly exerciseDailyLogRepository: Repository<UserExerciseDailyLog>;
  private readonly workoutDailyLogRepository: Repository<UserWorkoutDailyLog>;

  constructor() {
    this.exerciseDailyLogRepository = AppDataSource.getRepository(UserExerciseDailyLog);
    this.workoutDailyLogRepository = AppDataSource.getRepository(UserWorkoutDailyLog);
  }

  public async getExerciseLogsByWorkoutLogId(userId: string, id: string): Promise<UserExerciseDailyLog[]> {
    const workoutDailyLog = await this.workoutDailyLogRepository.findOne({
      where: { id },
      relations: { userDailyReport: { user: true } }
    });

    if (!workoutDailyLog) {
      throw new NotFoundException("Workout-Daily-Log not found");
    }

    if (workoutDailyLog.userDailyReport.user.id !== userId) {
      throw new UnauthorizedException("You are not authorized to access these ExerciseDailyLogs");
    }

    const exerciseDailyLogs = await this.exerciseDailyLogRepository.find({
      where: { userWorkoutDailyLog: { id: id } },
      order: { ordinalNumber: ESortOrder.ASC }
    });

    if (!exerciseDailyLogs || exerciseDailyLogs.length === 0) {
      throw new NotFoundException("Exercise-Daily-Logs not found");
    }

    return exerciseDailyLogs;
  }
}
