import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../common/enums";

export class HealthCheckController {
  public async healthCheck(): Promise<string> {
    return "OK";
  }

  public async check(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const healthCheck = await this.healthCheck();
      res.status(EHttpResponseCode.OK).json(healthCheck);
    } catch (error) {
      next(error);
    }
  }
}
