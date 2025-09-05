import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { FilterGlobalStatsQueryDto } from "../common/dto";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { UserGlobalStatsService } from "../services";

export class UserGlobalStatsController {
  constructor(private userGlobalStatsService = new UserGlobalStatsService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(FilterGlobalStatsQueryDto, req.query);
      const userDailyReport = await this.userGlobalStatsService.getAll(userId, dto);
      res.status(EHttpResponseCode.OK).json(userDailyReport);
    } catch (error) {
      next(error);
    }
  }

  public async getUserGlobalStatsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const userDailyReport = await this.userGlobalStatsService.getUserGlobalStatsByUserId(userId);
      res.status(EHttpResponseCode.OK).json(userDailyReport);
    } catch (error) {
      next(error);
    }
  }
}
