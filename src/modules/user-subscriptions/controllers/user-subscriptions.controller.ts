import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { UserSubscriptionsService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class UserSubscriptionsController {
  constructor(private readonly userSubscriptionsService = new UserSubscriptionsService()) {}

  public async getUserCoachSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const userSubscriptions = await this.userSubscriptionsService.getUserCoachSubscriptions(userId);
      res.status(EHttpResponseCode.OK).json(userSubscriptions);
    } catch (error) {
      next(error);
    }
  }
}
