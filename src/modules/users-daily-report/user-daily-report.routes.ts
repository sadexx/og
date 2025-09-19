import { Router } from "express";
import { UserDailyReportController } from "./controllers/user-daily-report.controller";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import { customPassportAuthenticate, validationMiddlewareQuery } from "../../common/middleware";
import { FilterUserDailyReportQueryDto } from "./common/dto";
import { featureAccessGuard } from "../subscription-plan/common/guards";
import { ESubscriptionFeature } from "../subscription-plan/common/enums";

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
      featureAccessGuard(ESubscriptionFeature.DAILY_REPORTS),
      validationMiddlewareQuery(FilterUserDailyReportQueryDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}/top-day`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.DAILY_REPORTS),
      validationMiddlewareQuery(FilterUserDailyReportQueryDto, globalQueryTransformer),
      this.controller.getTopDay.bind(this.controller)
    );
    this.router.get(
      `${this.path}/by-date`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.DAILY_REPORTS),
      validationMiddlewareQuery(FilterUserDailyReportQueryDto, globalQueryTransformer),
      this.controller.getByDate.bind(this.controller)
    );
  }
}
