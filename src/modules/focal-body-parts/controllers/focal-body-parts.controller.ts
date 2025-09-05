import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateFocalBodyPartDto, UpdateFocalBodyPartDto } from "../common/dto";
import { FocalBodyPartService } from "../services";

export class FocalBodyPartsController {
  constructor(private readonly focalBodyPartService = new FocalBodyPartService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const focalBodyParts = await this.focalBodyPartService.getAll();
      res.status(EHttpResponseCode.OK).json(focalBodyParts);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const focalBodyPart = await this.focalBodyPartService.getById(id);
      res.status(EHttpResponseCode.OK).json(focalBodyPart);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateFocalBodyPartDto, req.body);
      const focalBodyPart = await this.focalBodyPartService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(focalBodyPart);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateFocalBodyPartDto, req.body);
      const focalBodyPart = await this.focalBodyPartService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(focalBodyPart);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const focalBodyPart = await this.focalBodyPartService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(focalBodyPart);
    } catch (error) {
      next(error);
    }
  }
}
