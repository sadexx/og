import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import { customPassportAuthenticate, validationMiddlewareQuery } from "../../common/middleware";
import { UserGlobalStatsController } from "./controllers";
import { FilterGlobalStatsQueryDto } from "./common/dto/filter-global-stats.dto";
import { featureAccessGuard } from "../subscription-plan/common/guards";
import { ESubscriptionFeature } from "../subscription-plan/common/enums";

export class UserGlobalStatsRoutes {
  public path = `/${ERoutes.USERS_GLOBAL_STATS}`;
  public router = Router();
  public controller = new UserGlobalStatsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/leaderboard`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.LEADERBOARD),
      validationMiddlewareQuery(FilterGlobalStatsQueryDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.GLOBAL_STATS),
      this.controller.getUserGlobalStatsByUserId.bind(this.controller)
    );
  }
}
