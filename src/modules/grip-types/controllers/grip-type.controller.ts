import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateGripTypeDto, UpdateGripTypeDto, GripTypeIdsDto } from "../common/dto";
import { GripTypeService } from "../services";

export class GripTypeController {
  constructor(private gripTypeService = new GripTypeService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gripType = await this.gripTypeService.getAll();
      res.status(EHttpResponseCode.OK).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const gripType = await this.gripTypeService.getById(id);
      res.status(EHttpResponseCode.OK).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async getAllGripFirmwaresInGripType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const gripFirmwares = await this.gripTypeService.getAllGripFirmwaresInGripType(id);
      res.status(EHttpResponseCode.OK).json(gripFirmwares);
    } catch (error) {
      next(error);
    }
  }

  public async getLastVersionGripFirmwareInGripType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const gripFirmware = await this.gripTypeService.getLastVersionGripFirmwareInGripType(id);
      res.status(EHttpResponseCode.OK).json(gripFirmware);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateGripTypeDto, req.body);
      const gripType = await this.gripTypeService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateGripTypeDto, req.body);
      const gripType = await this.gripTypeService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async updateGripTypesOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GripTypeIdsDto, req.body);
      const gripTypes = await this.gripTypeService.updateGripTypesOrder(dto);
      res.status(EHttpResponseCode.CREATED).json(gripTypes);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const gripType = await this.gripTypeService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(gripType);
    } catch (error) {
      next(error);
    }
  }
}
