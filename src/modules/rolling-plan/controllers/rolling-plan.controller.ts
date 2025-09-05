import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { UpdateRollingPlanDto } from "../common/dto";
import { RollingPlanService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class RollingPlanController {
  constructor(private readonly rollingPlanService = new RollingPlanService()) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const rollingPlan = await this.rollingPlanService.get(userId);
      res.status(EHttpResponseCode.OK).json(rollingPlan);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(UpdateRollingPlanDto, req.body);
      const rollingPlan = await this.rollingPlanService.update(userId, dto);
      res.status(EHttpResponseCode.CREATED).json(rollingPlan);
    } catch (error) {
      next(error);
    }
  }

  public async deleteAllCycle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      await this.rollingPlanService.deleteAllCycle(userId);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
