import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { MetricsController } from "./controllers";

export class MetricsRoutes {
  public path = `/${ERoutes.METRICS}`;
  public router = Router();
  public controller = new MetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.controller.metrics.bind(this.controller));
  }
}
