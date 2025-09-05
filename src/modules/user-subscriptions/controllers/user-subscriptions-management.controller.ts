import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { UserSubscriptionsManagementService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class UserSubscriptionsManagementController {
  constructor(private readonly userSubscriptionsManagementService = new UserSubscriptionsManagementService()) {}

  public async subscribeToPremium(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      await this.userSubscriptionsManagementService.subscribeToPremium(id, userId);
      res.status(EHttpResponseCode.CREATED).json({ message: "Successfully subscribed." });
    } catch (error) {
      next(error);
    }
  }

  public async subscribeToCoach(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      await this.userSubscriptionsManagementService.subscribeToCoach(id, userId);
      res.status(EHttpResponseCode.CREATED).json({ message: "Successfully subscribed." });
    } catch (error) {
      next(error);
    }
  }

  public async unsubscribeUserSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.userSubscriptionsManagementService.userSubscriptionUnsubscribe(id);
      res.status(EHttpResponseCode.OK).json({ message: "Successfully unsubscribed." });
    } catch (error) {
      next(error);
    }
  }
}
