import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import {
  customPassportAuthenticate,
  validationMiddlewareQuery,
  validationMiddlewareParams
} from "../../common/middleware";
import { UserWorkoutDailyLogController } from "./controllers";
import { GetAllUsersWorkoutDailyLogDto } from "./common/dto";
import { GetByIdDto } from "../../common/dto";
import { featureAccessGuard } from "../subscription-plan/common/guards";
import { ESubscriptionFeature } from "../subscription-plan/common/enums";

export class UserWorkoutDailyLogRoutes {
  public path = `/${ERoutes.WORKOUT_DAILY_LOGS}`;
  public router = Router();
  public controller = new UserWorkoutDailyLogController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.PROGRESS_GRAPH),
      validationMiddlewareQuery(GetAllUsersWorkoutDailyLogDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}/titles`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.PROGRESS_GRAPH),
      this.controller.getAllUniqueTitle.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.PROGRESS_GRAPH),
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
  }
}
