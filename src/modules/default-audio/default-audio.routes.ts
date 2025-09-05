import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { CreateDefaultAudioDto, UpdateDefaultAudioDto } from "./common/dto";
import { DefaultAudioController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class DefaultAudioRoutes {
  public path = `/${ERoutes.DEFAULT_AUDIO}`;
  public router = Router();
  public controller = new DefaultAudioController();

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
      validationMiddlewareBody(CreateDefaultAudioDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateDefaultAudioDto),
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
