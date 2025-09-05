import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate } from "../../common/middleware";
import { BatchEntityFetcherController } from "./controllers";

export class BatchEntityFetcherRoutes {
  public path = `/${ERoutes.BATCH_ENTITY_FETCHERS}`;
  public router = Router();
  public controller = new BatchEntityFetcherController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/origins-data`, this.controller.getAllOrigins.bind(this.controller));
    this.router.get(
      `${this.path}/user-data`,
      customPassportAuthenticate,
      this.controller.getUserData.bind(this.controller)
    );
  }
}
