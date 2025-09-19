import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareParams,
  validationMiddlewareBody
} from "../../common/middleware";
import { CustomStretchingController } from "./controllers";
import { CreateCustomStretchingDto, UpdateCustomStretchingDto } from "./common/dto";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { featureAccessGuard } from "../subscription-plan/common/guards";
import { ESubscriptionFeature } from "../subscription-plan/common/enums";

export class CustomStretchingRoutes {
  public path = `/${ERoutes.CUSTOM_STRETCHES}`;
  public router = Router();
  public controller = new CustomStretchingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, customPassportAuthenticate, this.controller.getAll.bind(this.controller));
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.CUSTOM_STRETCHES),
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:id/custom-stretching-exercises`,
      customPassportAuthenticate,
      featureAccessGuard(ESubscriptionFeature.CUSTOM_STRETCHES),
      validationMiddlewareParams(GetByIdDto),
      this.controller.getCustomStretchingExercisesInCustomStretches.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_STRETCHES),
      validationMiddlewareBody(CreateCustomStretchingDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_STRETCHES),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateCustomStretchingDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      featureAccessGuard(ESubscriptionFeature.CUSTOM_STRETCHES),
      validationMiddlewareParams(GetByIdDto),
      this.controller.delete.bind(this.controller)
    );
  }
}
