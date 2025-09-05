import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { SubscriptionPlanService } from "../services/subscription-plan.service";
import { BatchUpdateSubscriptionPlansDto } from "../common/dto";

export class SubscriptionPlanController {
  constructor(private readonly subscriptionPlanService = new SubscriptionPlanService()) {}

  public async getSubscriptionPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscriptionPlans = await this.subscriptionPlanService.getSubscriptionPlans();
      res.status(EHttpResponseCode.OK).json(subscriptionPlans);
    } catch (error) {
      next(error);
    }
  }

  public async getSubscriptionPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const subscriptionPlan = await this.subscriptionPlanService.getSubscriptionPlan(id);
      res.status(EHttpResponseCode.OK).json(subscriptionPlan);
    } catch (error) {
      next(error);
    }
  }

  public async batchUpdateSubscriptionPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(BatchUpdateSubscriptionPlansDto, req.body);
      await this.subscriptionPlanService.batchUpdateSubscriptionPlans(dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }
}
