import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateStrainClassDto, UpdateStrainClassDto } from "../common/dto";
import { StrainClassService } from "../services";

export class StrainClassController {
  constructor(private strainClassService = new StrainClassService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const strainClasses = await this.strainClassService.getAll();
      res.status(EHttpResponseCode.OK).json(strainClasses);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const strainClass = await this.strainClassService.getById(id);
      res.status(EHttpResponseCode.OK).json(strainClass);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateStrainClassDto, req.body);
      const strainClass = await this.strainClassService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(strainClass);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateStrainClassDto, req.body);
      const strainClass = await this.strainClassService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(strainClass);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const strainClass = await this.strainClassService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(strainClass);
    } catch (error) {
      next(error);
    }
  }
}
