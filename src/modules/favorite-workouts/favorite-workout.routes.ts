import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareParams,
  validationMiddlewareBody
} from "../../common/middleware";
import { CreateFavoriteWorkoutDto, UpdateFavoriteWorkoutDto } from "./common/dto";
import { FavoriteWorkoutController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { featureAccessGuard } from "../subscription-plan/common/guards";
import { ESubscriptionFeature } from "../subscription-plan/common/enums";

export class FavoriteWorkoutRoutes {
  public path = `/${ERoutes.FAVORITE_WORKOUTS}`;
  public router = Router();
  public controller = new FavoriteWorkoutController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_WORKOUTS),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_WORKOUTS),
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_WORKOUTS),
      validationMiddlewareBody(CreateFavoriteWorkoutDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_WORKOUTS),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateFavoriteWorkoutDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_WORKOUTS),
      validationMiddlewareParams(GetByIdDto),
      this.controller.delete.bind(this.controller)
    );
  }
}
