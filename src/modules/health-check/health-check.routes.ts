import { Router } from "express";
import { HealthCheckController } from "./health-check.controller";
import { ERoutes } from "../../common/enums";

export class HealthCheckRoutes {
  public path = `/${ERoutes.HEALTH_CHECK}`;
  public router = Router();
  public controller = new HealthCheckController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.controller.check.bind(this.controller));
  }
}
