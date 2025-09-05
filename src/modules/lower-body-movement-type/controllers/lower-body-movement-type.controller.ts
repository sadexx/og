import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import {
  CreateLowerBodyMovementTypeDto,
  UpdateLowerBodyMovementTypeDto,
  LowerBodyMovementTypeIdsDto
} from "../common/dto";
import { LowerBodyMovementTypeService } from "../services";

export class LowerBodyMovementTypeController {
  constructor(private readonly lowerBodyMovementService = new LowerBodyMovementTypeService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lowerBodyMovementTypes = await this.lowerBodyMovementService.getAll();
      res.status(EHttpResponseCode.OK).json(lowerBodyMovementTypes);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lowerBodyMovementType = await this.lowerBodyMovementService.getById(id);
      res.status(EHttpResponseCode.OK).json(lowerBodyMovementType);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateLowerBodyMovementTypeDto, req.body);
      const lowerBodyMovementType = await this.lowerBodyMovementService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(lowerBodyMovementType);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateLowerBodyMovementTypeDto, req.body);
      const lowerBodyMovementType = await this.lowerBodyMovementService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(lowerBodyMovementType);
    } catch (error) {
      next(error);
    }
  }

  public async updateLowerBodyMovementTypeOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(LowerBodyMovementTypeIdsDto, req.body);
      const lowerBodyMovementType = await this.lowerBodyMovementService.updateLowerBodyMovementTypeOrder(dto);
      res.status(EHttpResponseCode.CREATED).json(lowerBodyMovementType);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lowerBodyMovementType = await this.lowerBodyMovementService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(lowerBodyMovementType);
    } catch (error) {
      next(error);
    }
  }
}
