import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { LowerBodyMovementTypeController } from "./controllers";
import {
  CreateLowerBodyMovementTypeDto,
  LowerBodyMovementTypeIdsDto,
  UpdateLowerBodyMovementTypeDto
} from "./common/dto";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class LowerBodyMovementTypeRoutes {
  public path = `/${ERoutes.LOWER_BODY_MOVEMENT}`;
  public router = Router();
  public controller = new LowerBodyMovementTypeController();

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
      validationMiddlewareBody(CreateLowerBodyMovementTypeDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(LowerBodyMovementTypeIdsDto),
      this.controller.updateLowerBodyMovementTypeOrder.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateLowerBodyMovementTypeDto),
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
