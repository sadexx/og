import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { CreateStretchingDto, StretchingIdsDto, UpdateStretchingDto, StretchingExerciseIdsDto } from "./common/dto";
import { StretchingController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class StretchingRoutes {
  public path = `/${ERoutes.STRETCHES}`;
  public router = Router();
  public controller = new StretchingController();

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
    this.router.get(
      `${this.path}/:id/stretching-exercises`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getStretchingExercisesInStretching.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateStretchingDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(StretchingIdsDto),
      this.controller.updateStretchersOrder.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateStretchingDto),
      this.controller.update.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id/stretching-exercises/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(StretchingExerciseIdsDto),
      this.controller.updateStretchingExercisesOrder.bind(this.controller)
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
