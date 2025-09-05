import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { FilterUserDailyReportQueryDto } from "../common/dto";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { UserDailyReportService } from "../services";

export class UserDailyReportController {
  constructor(private userDailyReportService = new UserDailyReportService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(FilterUserDailyReportQueryDto, req.query);
      const userDailyReport = await this.userDailyReportService.getAll(userId, dto);
      res.status(EHttpResponseCode.OK).json(userDailyReport);
    } catch (error) {
      next(error);
    }
  }

  public async getTopDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(FilterUserDailyReportQueryDto, req.query);
      const userTopDailyReport = await this.userDailyReportService.getTopDay(userId, dto);
      res.status(EHttpResponseCode.OK).json(userTopDailyReport);
    } catch (error) {
      next(error);
    }
  }

  public async getByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(FilterUserDailyReportQueryDto, req.query);
      const userDailyReport = await this.userDailyReportService.getByDate(userId, dto);
      res.status(EHttpResponseCode.OK).json(userDailyReport);
    } catch (error) {
      next(error);
    }
  }
}
