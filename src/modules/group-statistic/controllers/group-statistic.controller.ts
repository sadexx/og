import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { GroupMembershipStatisticQueryService, GroupMembershipStatisticService } from "../services";
import { JwtPayload } from "../../auth/common/dto";
import {
  CreateGroupMembershipStatisticDto,
  GetGroupMembershipStatisticDailyDto,
  GetGroupMembershipStatisticMonthlyDto,
  GetGroupStatisticCalendarDto
} from "../common/dto";

export class GroupStatisticController {
  constructor(
    private readonly groupStatisticService = new GroupMembershipStatisticService(),
    private readonly groupStatisticQueryService = new GroupMembershipStatisticQueryService()
  ) {}

  public async getDailyStatistic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(GetGroupMembershipStatisticDailyDto, req.query);
      const groupMembershipStatistic = await this.groupStatisticQueryService.getDailyStatistic(id, dto);
      res.status(EHttpResponseCode.OK).json(groupMembershipStatistic);
    } catch (error) {
      next(error);
    }
  }

  public async getMonthlyStatistic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(GetGroupMembershipStatisticMonthlyDto, req.query);
      const groupMembershipStatistic = await this.groupStatisticQueryService.getMonthlyStatistic(id, dto);
      res.status(EHttpResponseCode.OK).json(groupMembershipStatistic);
    } catch (error) {
      next(error);
    }
  }

  public async getGroupStatisticCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(GetGroupStatisticCalendarDto, req.query);
      const statisticCalendar = await this.groupStatisticQueryService.getGroupStatisticCalendar(id, dto);
      res.status(EHttpResponseCode.OK).json(statisticCalendar);
    } catch (error) {
      next(error);
    }
  }

  public async createGroupMembershipStatistic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(CreateGroupMembershipStatisticDto, req.body);
      await this.groupStatisticService.createGroupMembershipStatistic(id, user.id, dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }
}
