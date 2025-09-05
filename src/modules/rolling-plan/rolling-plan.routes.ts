import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareBody } from "../../common/middleware";
import { UpdateRollingPlanDto } from "./common/dto";
import { RollingPlanController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class RollingPlanRoutes {
  public path = `/${ERoutes.ROLLING_PLANS}`;
  public router = Router();
  public controller = new RollingPlanController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.controller.get.bind(this.controller)
    );
    this.router.put(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareBody(UpdateRollingPlanDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.controller.deleteAllCycle.bind(this.controller)
    );
  }
}
