import { Between, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { NotFoundException } from "../../../common/exceptions";
import { ReadStatisticsDto, ReadExerciseDailyLogDto } from "../common/dto";
import { getStartAndEndOfDay } from "../common/helpers";
import { User } from "../../users/schemas";
import { CreateUserDailyReportDto } from "../../users-daily-report/common/dto";
import { UserDailyReport } from "../../users-daily-report/schemas";
import { UserExerciseDailyLog } from "../../users-exercise-daily-log/schemas";
import { CreateExerciseDailyLogDto } from "../../users-exercise-daily-log/common/dto";
import { CreateUserGlobalStatsDto } from "../../users-global-stats/common/dto";
import { UserGlobalStats } from "../../users-global-stats/schemas";
import { CreateWorkoutDailyLogDto } from "../../users-workout-daily-log/common/dto";
import { UserWorkoutDailyLog } from "../../users-workout-daily-log/schemas";

export class StatisticsService {
  private readonly usersRepository: Repository<User>;
  private readonly usersDailyReportRepository: Repository<UserDailyReport>;
  private readonly userGlobalStatsRepository: Repository<UserGlobalStats>;
  private readonly workoutsDailyLogRepository: Repository<UserWorkoutDailyLog>;
  private readonly exercisesDailyLogRepository: Repository<UserExerciseDailyLog>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
    this.usersDailyReportRepository = AppDataSource.getRepository(UserDailyReport);
    this.userGlobalStatsRepository = AppDataSource.getRepository(UserGlobalStats);
    this.workoutsDailyLogRepository = AppDataSource.getRepository(UserWorkoutDailyLog);
    this.exercisesDailyLogRepository = AppDataSource.getRepository(UserExerciseDailyLog);
  }

  public async create(userId: string, dto: ReadStatisticsDto): Promise<string> {
    const user = await this.findUserById(userId);
    const workoutDate = new Date(dto.createdDate);
    const totalCompletedQuantity =
      dto.totalCompletedQuantityWithBluetoothConnection + dto.totalCompletedQuantityWithoutBluetoothConnection;
    const { startOfDay, endOfDay } = getStartAndEndOfDay(workoutDate);
    let userDailyReport = await this.findUserDailyReport(user, startOfDay, endOfDay);
    const userGlobalStats = await this.findGlobalStats(user);

    userDailyReport = await this.createOrUpdateDailyReport(user, userDailyReport, dto, totalCompletedQuantity);

    await this.createOrUpdateGlobalStats(user, userGlobalStats, dto, totalCompletedQuantity);

    const workoutDailyLog = await this.createWorkoutDailyLog(userDailyReport, dto, totalCompletedQuantity);

    await this.createExerciseDailyLogs(workoutDailyLog, dto.workoutExerciseLogs);

    return workoutDailyLog.id;
  }

  private async findUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  private async findUserDailyReport(user: User, startOfDay: Date, endOfDay: Date): Promise<UserDailyReport | null> {
    return await this.usersDailyReportRepository.findOne({
      where: {
        user: { id: user.id },
        createdDate: Between(startOfDay, endOfDay)
      }
    });
  }

  private async createOrUpdateDailyReport(
    user: User,
    userDailyReport: UserDailyReport | null,
    dto: ReadStatisticsDto,
    totalCompletedQuantity: number
  ): Promise<UserDailyReport> {
    if (userDailyReport) {
      await this.usersDailyReportRepository.update(userDailyReport.id, {
        totalStrain: userDailyReport.totalStrain + dto.totalStrain,
        totalMaxStrain: userDailyReport.totalMaxStrain + dto.totalMaxStrain,
        totalAvgMaxStrain: userDailyReport.totalAvgMaxStrain + dto.totalAvgMaxStrain,
        totalCompletedQuantity: userDailyReport.totalCompletedQuantity + totalCompletedQuantity,
        totalCompletedQuantityWithBluetoothConnection:
          userDailyReport.totalCompletedQuantityWithBluetoothConnection +
          dto.totalCompletedQuantityWithBluetoothConnection,
        totalCompletedQuantityWithoutBluetoothConnection:
          userDailyReport.totalCompletedQuantityWithoutBluetoothConnection +
          dto.totalCompletedQuantityWithoutBluetoothConnection,
        totalCaloriesBurned: userDailyReport.totalCaloriesBurned + dto.totalCaloriesBurned,
        totalDuration: userDailyReport.totalDuration + dto.duration,
        totalNumberOfIntervals: userDailyReport.totalNumberOfIntervals + dto.totalNumberOfIntervals
      });
    } else {
      const createDailyWorkout: CreateUserDailyReportDto = this.usersDailyReportRepository.create({
        user,
        totalStrain: dto.totalStrain,
        totalMaxStrain: dto.totalMaxStrain,
        totalAvgMaxStrain: dto.totalAvgMaxStrain,
        totalCompletedQuantity: totalCompletedQuantity,
        totalCompletedQuantityWithBluetoothConnection: dto.totalCompletedQuantityWithBluetoothConnection,
        totalCompletedQuantityWithoutBluetoothConnection: dto.totalCompletedQuantityWithoutBluetoothConnection,
        totalCaloriesBurned: dto.totalCaloriesBurned,
        totalDuration: dto.duration,
        totalNumberOfIntervals: dto.totalNumberOfIntervals,
        createdDate: new Date(dto.createdDate)
      });
      userDailyReport = await this.usersDailyReportRepository.save(createDailyWorkout);
    }

    return userDailyReport;
  }

  private async findGlobalStats(user: User): Promise<UserGlobalStats | null> {
    return await this.userGlobalStatsRepository.findOne({
      where: { user: { id: user.id } }
    });
  }

  private async createOrUpdateGlobalStats(
    user: User,
    userGlobalStats: UserGlobalStats | null,
    dto: ReadStatisticsDto,
    totalCompletedQuantity: number
  ): Promise<UserGlobalStats> {
    if (userGlobalStats) {
      await this.userGlobalStatsRepository.update(userGlobalStats.id, {
        totalStrain: BigInt(userGlobalStats.totalStrain) + BigInt(dto.totalStrain),
        totalMaxStrain: userGlobalStats.totalMaxStrain + dto.totalMaxStrain,
        totalAvgMaxStrain: userGlobalStats.totalAvgMaxStrain + dto.totalAvgMaxStrain,
        totalCompletedQuantity: userGlobalStats.totalCompletedQuantity + totalCompletedQuantity,
        totalCompletedQuantityWithBluetoothConnection:
          userGlobalStats.totalCompletedQuantityWithBluetoothConnection +
          dto.totalCompletedQuantityWithBluetoothConnection,
        totalCompletedQuantityWithoutBluetoothConnection:
          userGlobalStats.totalCompletedQuantityWithoutBluetoothConnection +
          dto.totalCompletedQuantityWithoutBluetoothConnection,
        totalCaloriesBurned: userGlobalStats.totalCaloriesBurned + dto.totalCaloriesBurned,
        totalDuration: userGlobalStats.totalDuration + dto.duration,
        totalNumberOfIntervals: userGlobalStats.totalNumberOfIntervals + dto.totalNumberOfIntervals
      });
    } else {
      const createUserGlobalStatsDto: CreateUserGlobalStatsDto = {
        user,
        totalStrain: BigInt(dto.totalStrain),
        totalMaxStrain: dto.totalMaxStrain,
        totalAvgMaxStrain: dto.totalAvgMaxStrain,
        totalCompletedQuantity: totalCompletedQuantity,
        totalCompletedQuantityWithBluetoothConnection: dto.totalCompletedQuantityWithBluetoothConnection,
        totalCompletedQuantityWithoutBluetoothConnection: dto.totalCompletedQuantityWithoutBluetoothConnection,
        totalCaloriesBurned: dto.totalCaloriesBurned,
        totalDuration: dto.duration,
        totalNumberOfIntervals: dto.totalNumberOfIntervals
      };
      userGlobalStats = await this.userGlobalStatsRepository.save(createUserGlobalStatsDto);
    }

    return userGlobalStats;
  }

  private async createWorkoutDailyLog(
    userDailyReport: UserDailyReport,
    dto: ReadStatisticsDto,
    totalCompletedQuantity: number
  ): Promise<UserWorkoutDailyLog> {
    const createWorkoutDailyLog: CreateWorkoutDailyLogDto = this.workoutsDailyLogRepository.create({
      userDailyReport,
      ...dto,
      totalCompletedQuantity: totalCompletedQuantity,
      totalCompletedQuantityWithBluetoothConnection: dto.totalCompletedQuantityWithBluetoothConnection,
      totalCompletedQuantityWithoutBluetoothConnection: dto.totalCompletedQuantityWithoutBluetoothConnection,
      totalNumberOfIntervals: dto.totalNumberOfIntervals,
      createdDate: new Date(dto.createdDate),
      updatedDate: new Date(dto.updatedDate),
      completionDate: new Date(dto.completionDate)
    });

    const workoutDailyLog = await this.workoutsDailyLogRepository.save(createWorkoutDailyLog);

    return workoutDailyLog;
  }

  private async createExerciseDailyLogs(
    workoutDailyLog: UserWorkoutDailyLog,
    workoutLogs: ReadExerciseDailyLogDto[]
  ): Promise<void> {
    const exerciseLogs: CreateExerciseDailyLogDto[] = workoutLogs.map((log) => ({
      userWorkoutDailyLog: workoutDailyLog,
      userExerciseDailyLogOnPhoneId: log.userExerciseDailyLogOnPhoneId,
      workoutExerciseId: log.workoutExerciseId,
      ordinalNumber: log.ordinalNumber,
      primaryExerciseTitle: log.primaryExerciseTitle,
      primaryExerciseQuantityUnit: log.primaryExerciseQuantityUnit,
      secondaryExerciseTitle: log.secondaryExerciseTitle,
      circuit: log.circuit,
      set: log.set,
      totalCompletedQuantity:
        log.completedQuantityWithBluetoothConnection + log.completedQuantityWithoutBluetoothConnection,
      completedQuantityWithBluetoothConnection: log.completedQuantityWithBluetoothConnection,
      completedQuantityWithoutBluetoothConnection: log.completedQuantityWithoutBluetoothConnection,
      targetQuantity: log.targetQuantity,
      caloriesBurned: log.caloriesBurned,
      strain: log.strain,
      lastMaxStrain: log.lastMaxStrain,
      maxStrain: log.maxStrain,
      avgMaxStrain: log.avgMaxStrain,
      duration: log.duration,
      restDuration: log.restDuration,
      notes: log.notes,
      createdDate: new Date(log.createdDate),
      completionDate: new Date(log.completionDate)
    }));

    await this.exercisesDailyLogRepository.save(exerciseLogs);
  }
}
