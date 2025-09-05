import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { validationMiddlewareParams } from "../../common/middleware";
import { AudioController } from "./controllers";
import { GetByIdDto } from "../../common/dto";

export class AudioRoutes {
  public path = `/${ERoutes.AUDIO}`;
  public router = Router();
  public controller = new AudioController();

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
  }
}
