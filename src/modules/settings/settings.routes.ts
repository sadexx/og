import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { validationMiddlewareBody } from "../../common/middleware";
import { UpdateSettingsDto } from "./common/dto";
import { SettingsController } from "./controllers";

export class SettingsRoutes {
  public path = `/${ERoutes.SETTINGS}`;
  public router = Router();
  public controller = new SettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.controller.get.bind(this.controller));

    this.router.put(
      `${this.path}`,
      validationMiddlewareBody(UpdateSettingsDto),
      this.controller.update.bind(this.controller)
    );
  }
}
