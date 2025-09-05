import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareParams } from "../../common/middleware";
import { UserSubscriptionsController, UserSubscriptionsManagementController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { GetByIdDto } from "../../common/dto";

export class UserSubscriptionsRoutes {
  public path = `/${ERoutes.USER_SUBSCRIPTIONS}`;
  public router = Router();
  public userSubscriptionsController = new UserSubscriptionsController();
  public userSubscriptionsManagementController = new UserSubscriptionsManagementController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/coach/list`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.userSubscriptionsController.getUserCoachSubscriptions.bind(this.userSubscriptionsController)
    );
    this.router.post(
      `${this.path}/subscribe/:id/premium`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.userSubscriptionsManagementController.subscribeToPremium.bind(this.userSubscriptionsManagementController)
    );
    this.router.post(
      `${this.path}/subscribe/:id/coach`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.userSubscriptionsManagementController.subscribeToCoach.bind(this.userSubscriptionsManagementController)
    );
    this.router.put(
      `${this.path}/:id/unsubscribe`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.userSubscriptionsManagementController.unsubscribeUserSubscription.bind(
        this.userSubscriptionsManagementController
      )
    );
  }
}
