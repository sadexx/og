import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareBody,
  validationMiddlewareParams,
  validationMiddlewareQuery
} from "../../common/middleware";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { GetByIdDto } from "../../common/dto";
import { globalQueryTransformer } from "../../common/helpers";
import { GroupStatisticController } from "./controllers";
import {
  CreateGroupMembershipStatisticDto,
  GetGroupMembershipStatisticDailyDto,
  GetGroupMembershipStatisticMonthlyDto,
  GetGroupStatisticCalendarDto
} from "./common/dto";

export class GroupStatisticRoutes {
  public path = `/${ERoutes.GROUPS}/statistics`;
  public router = Router();
  public groupStatisticController = new GroupStatisticController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/:id/daily`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareQuery(GetGroupMembershipStatisticDailyDto, globalQueryTransformer),
      this.groupStatisticController.getDailyStatistic.bind(this.groupStatisticController)
    );
    this.router.get(
      `${this.path}/:id/monthly`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareQuery(GetGroupMembershipStatisticMonthlyDto, globalQueryTransformer),
      this.groupStatisticController.getMonthlyStatistic.bind(this.groupStatisticController)
    );
    this.router.get(
      `${this.path}/:id/calendar`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareQuery(GetGroupStatisticCalendarDto, globalQueryTransformer),
      this.groupStatisticController.getGroupStatisticCalendar.bind(this.groupStatisticController)
    );
    this.router.post(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(CreateGroupMembershipStatisticDto),
      this.groupStatisticController.createGroupMembershipStatistic.bind(this.groupStatisticController)
    );
  }
}
