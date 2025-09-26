import { Request, Response, NextFunction } from "express";
import { EHttpResponseCode } from "../../../../common/enums";
import { WebhookService } from "../services/webhook.service";

export class WebhookController {
  constructor(private readonly webhookService = WebhookService.getInstance()) {}

  public async getManualStatusCheck(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      void this.webhookService.getManualStatusCheckWebhook();
      res.status(EHttpResponseCode.OK).json({ message: "Launch: Manual status checks" });
    } catch (error) {
      next(error);
    }
  }
}
