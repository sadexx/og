import { Router } from "express";
import { ERoutes } from "../../../common/enums";
import { WebhookController } from "./controllers";

export class WebhookRoutes {
  public path = `/${ERoutes.WEBHOOK}`;
  public router = Router();
  public controller = new WebhookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/manual-status-checks`, this.controller.getManualStatusCheck.bind(this.controller));
  }
}
