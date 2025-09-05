import { Router } from "express";
import { UserDailyReportController } from "./controllers/user-daily-report.controller";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import { customPassportAuthenticate, validationMiddlewareQuery } from "../../common/middleware";
import { FilterUserDailyReportQueryDto } from "./common/dto";

export class UserDailyReportRoutes {
  public path = `/${ERoutes.USERS_DAILY_REPORT}`;
  public router = Router();
  public controller = new UserDailyReportController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      validationMiddlewareQuery(FilterUserDailyReportQueryDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}/top-day`,
      customPassportAuthenticate,
      validationMiddlewareQuery(FilterUserDailyReportQueryDto, globalQueryTransformer),
      this.controller.getTopDay.bind(this.controller)
    );
    this.router.get(
      `${this.path}/by-date`,
      customPassportAuthenticate,
      validationMiddlewareQuery(FilterUserDailyReportQueryDto, globalQueryTransformer),
      this.controller.getByDate.bind(this.controller)
    );
  }
}
