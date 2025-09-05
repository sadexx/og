import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { BatchEntityFetcherService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class BatchEntityFetcherController {
  constructor(private readonly batchEntityFetcherService = new BatchEntityFetcherService()) {}

  public async getAllOrigins(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const originalEntities = await this.batchEntityFetcherService.getAllOrigins();
      res.status(EHttpResponseCode.OK).json(originalEntities);
    } catch (error) {
      next(error);
    }
  }

  public async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const userEntities = await this.batchEntityFetcherService.getUserData(userId);
      res.status(EHttpResponseCode.OK).json(userEntities);
    } catch (error) {
      next(error);
    }
  }
}
