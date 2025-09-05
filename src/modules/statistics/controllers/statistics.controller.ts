import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { plainToInstance } from "class-transformer";
import { ReadStatisticsDto } from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { StatisticsService } from "../services";

export class StatisticsController {
  constructor(private statisticsService = new StatisticsService()) {}

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(ReadStatisticsDto, req.body);
      const workoutDailyLog = await this.statisticsService.create(userId, dto);
      res.status(EHttpResponseCode.CREATED).json({ message: "Statistics created", id: workoutDailyLog });
    } catch (error) {
      next(error);
    }
  }
}
