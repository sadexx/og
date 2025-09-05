import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareBody,
  validationMiddlewareParams
} from "../../common/middleware";
import { PremiumSubscriptionsController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { GetByIdDto } from "../../common/dto";
import { UpdatePremiumSubscriptionDto } from "./common/dto";

export class PremiumSubscriptionsRoutes {
  public path = `/${ERoutes.PREMIUM_SUBSCRIPTIONS}`;
  public router = Router();
  public premiumSubscriptionsController = new PremiumSubscriptionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/admin`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      this.premiumSubscriptionsController.getPremiumSubscriptionsForAdmin.bind(this.premiumSubscriptionsController)
    );
    this.router.get(
      `${this.path}/user`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.premiumSubscriptionsController.getPremiumSubscriptionsForUser.bind(this.premiumSubscriptionsController)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdatePremiumSubscriptionDto),
      this.premiumSubscriptionsController.updatePremiumSubscription.bind(this.premiumSubscriptionsController)
    );
  }
}
