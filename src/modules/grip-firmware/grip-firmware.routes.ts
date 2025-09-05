import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { GripFirmwareController } from "./controllers";
import { CreateGripFirmwareDto, UpdateGripFirmwareDto } from "./common/dto";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class GripFirmwareRoutes {
  public path = `/${ERoutes.GRIP_FIRMWARES}`;
  public router = Router();
  public controller = new GripFirmwareController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/:id`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateGripFirmwareDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateGripFirmwareDto),
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
