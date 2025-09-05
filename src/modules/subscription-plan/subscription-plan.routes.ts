import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareBody,
  validationMiddlewareParams
} from "../../common/middleware";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { GetByIdDto } from "../../common/dto";
import { SubscriptionPlanController } from "./controllers";
import { BatchUpdateSubscriptionPlansDto } from "./common/dto";

export class SubscriptionPlanRoutes {
  public path = `/${ERoutes.SUBSCRIPTION_PLANS}`;
  public router = Router();
  public subscriptionPlanController = new SubscriptionPlanController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.subscriptionPlanController.getSubscriptionPlans.bind(this.subscriptionPlanController)
    );
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.subscriptionPlanController.getSubscriptionPlan.bind(this.subscriptionPlanController)
    );
    this.router.put(
      `${this.path}/batch-update`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(BatchUpdateSubscriptionPlansDto),
      this.subscriptionPlanController.batchUpdateSubscriptionPlans.bind(this.subscriptionPlanController)
    );
  }
}
