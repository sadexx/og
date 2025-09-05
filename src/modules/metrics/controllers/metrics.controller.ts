import { Request, Response, type NextFunction } from "express";
import { MetricsService } from "../services/metrics.service";
import { register } from "prom-client";

export class MetricsController {
  constructor(private metricsService = MetricsService.getInstance()) {}

  public async metrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await this.metricsService.getMetrics();
      res.set("Content-Type", register.contentType).send(metrics);
    } catch (error) {
      next(error);
    }
  }
}
