import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateActivityTypeDto, UpdateActivityTypeDto } from "../common/dto";
import { ActivityTypeService } from "../services";

export class ActivityTypeController {
  constructor(private readonly activityTypeService = new ActivityTypeService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activityType = await this.activityTypeService.getAll();
      res.status(EHttpResponseCode.OK).json(activityType);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const activityType = await this.activityTypeService.getById(id);
      res.status(EHttpResponseCode.OK).json(activityType);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateActivityTypeDto, req.body);
      const activityType = await this.activityTypeService.create(dto);

      res.status(EHttpResponseCode.CREATED).json(activityType);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateActivityTypeDto, req.body);
      const activityType = await this.activityTypeService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(activityType);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const activityType = await this.activityTypeService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(activityType);
    } catch (error) {
      next(error);
    }
  }
}
