import { NextFunction, Request, Response } from "express";
import { ESubscriptionFeature } from "../enums";
import { JwtPayload } from "../../../auth/common/dto";
import { SubscriptionPlanService } from "../../services/subscription-plan.service";
import { EHttpResponseCode } from "../../../../common/enums";
import { ERole } from "../../../users/common/enums";

const subscriptionPlanService = SubscriptionPlanService.getInstance();

export function featureAccessGuard(requiredFeature: ESubscriptionFeature) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as JwtPayload;

    if (user.role === ERole.ADMIN) {
      next();

      return;
    }

    const subscriptionPlan = await subscriptionPlanService.getUserSubscriptionPlan(user.id);

    if (!subscriptionPlan[requiredFeature]) {
      res.status(EHttpResponseCode.FORBIDDEN).json({ message: "Forbidden request" });

      return;
    }

    next();
  };
}
