import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { LogsController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { customPassportAuthenticate } from "../../common/middleware";

export class LogsRoutes {
  public path = `/${ERoutes.LOGS_API}`;
  public router = Router();
  public controller = new LogsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/list`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      this.controller.listLogs.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:filename`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      this.controller.downloadLog.bind(this.controller)
    );
  }
}
