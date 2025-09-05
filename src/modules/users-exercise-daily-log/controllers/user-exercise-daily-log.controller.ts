import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { UserExerciseDailyLogService } from "../services";

export class UserExerciseDailyLogController {
  constructor(private userExerciseDailyLogService = new UserExerciseDailyLogService()) {}

  public async getExerciseLogsByWorkoutLogId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const exerciseDailyLog = await this.userExerciseDailyLogService.getExerciseLogsByWorkoutLogId(userId, id);
      res.status(EHttpResponseCode.OK).json(exerciseDailyLog);
    } catch (error) {
      next(error);
    }
  }
}
