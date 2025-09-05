import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { ActivityTypeController } from "./controllers";
import { CreateActivityTypeDto, UpdateActivityTypeDto } from "./common/dto";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class ActivityTypeRoutes {
  public path = `/${ERoutes.ACTIVITY_TYPES}`;
  public router = Router();
  public controller = new ActivityTypeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.controller.getAll.bind(this.controller));
    this.router.get(
      `${this.path}/:id`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateActivityTypeDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateActivityTypeDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.controller.delete.bind(this.controller)
    );
  }
}
