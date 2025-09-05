import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateEquipmentsDto, UpdateEquipmentsDto } from "../common/dto";
import { EquipmentsService } from "../services";

export class EquipmentsController {
  constructor(private readonly equipmentsService = new EquipmentsService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipments = await this.equipmentsService.getAll();
      res.status(EHttpResponseCode.OK).json(equipments);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const equipments = await this.equipmentsService.getById(id);
      res.status(EHttpResponseCode.OK).json(equipments);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateEquipmentsDto, req.body);
      const equipments = await this.equipmentsService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(equipments);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateEquipmentsDto, req.body);
      const equipments = await this.equipmentsService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(equipments);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const equipments = await this.equipmentsService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(equipments);
    } catch (error) {
      next(error);
    }
  }
}
