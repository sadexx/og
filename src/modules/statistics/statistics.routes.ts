import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareBody } from "../../common/middleware";
import { ReadStatisticsDto } from "./common/dto";
import { StatisticsController } from "./controllers";

export class StatisticsRoutes {
  public path = `/${ERoutes.STATISTICS}`;
  public router = Router();
  public controller = new StatisticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      validationMiddlewareBody(ReadStatisticsDto),
      this.controller.create.bind(this.controller)
    );
  }
}
