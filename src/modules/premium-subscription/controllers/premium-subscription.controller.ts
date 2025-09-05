import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { PremiumSubscriptionService } from "../services";
import { UpdatePremiumSubscriptionDto } from "../common/dto";
import { plainToInstance } from "class-transformer";

export class PremiumSubscriptionsController {
  constructor(private readonly premiumSubscriptionService = new PremiumSubscriptionService()) {}

  public async getPremiumSubscriptionsForAdmin(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const premiumSubscriptions = await this.premiumSubscriptionService.getPremiumSubscriptionsForAdmin();
      res.status(EHttpResponseCode.OK).json(premiumSubscriptions);
    } catch (error) {
      next(error);
    }
  }

  public async getPremiumSubscriptionsForUser(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const premiumSubscriptions = await this.premiumSubscriptionService.getPremiumSubscriptionsForUser();
      res.status(EHttpResponseCode.OK).json(premiumSubscriptions);
    } catch (error) {
      next(error);
    }
  }

  public async updatePremiumSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdatePremiumSubscriptionDto, req.body);
      await this.premiumSubscriptionService.updatePremiumSubscription(id, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }
}
