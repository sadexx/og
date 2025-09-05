import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { UserWorkoutDailyLogService } from "../services";
import { GetAllUsersWorkoutDailyLogDto } from "../common/dto";
import { plainToInstance } from "class-transformer";

export class UserWorkoutDailyLogController {
  constructor(private userWorkoutDailyLogService = new UserWorkoutDailyLogService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(GetAllUsersWorkoutDailyLogDto, req.query);
      const workoutDailyLog = await this.userWorkoutDailyLogService.getAll(userId, dto);
      res.status(EHttpResponseCode.OK).json(workoutDailyLog);
    } catch (error) {
      next(error);
    }
  }

  public async getAllUniqueTitle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const workoutDailyLog = await this.userWorkoutDailyLogService.getAllUniqueTitle(userId);
      res.status(EHttpResponseCode.OK).json(workoutDailyLog);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutDailyLog = await this.userWorkoutDailyLogService.getById(id);
      res.status(EHttpResponseCode.OK).json(workoutDailyLog);
    } catch (error) {
      next(error);
    }
  }
}
