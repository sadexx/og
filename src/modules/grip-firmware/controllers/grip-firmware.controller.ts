import { Request, Response, type NextFunction } from "express";
import { GripFirmwareService } from "../services";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { CreateGripFirmwareDto, UpdateGripFirmwareDto } from "../common/dto";

export class GripFirmwareController {
  constructor(private gripFirmwareService = new GripFirmwareService()) {}

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const gripType = await this.gripFirmwareService.getById(id);
      res.status(EHttpResponseCode.OK).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateGripFirmwareDto, req.body);
      const gripType = await this.gripFirmwareService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateGripFirmwareDto, req.body);
      const gripType = await this.gripFirmwareService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(gripType);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const gripType = await this.gripFirmwareService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(gripType);
    } catch (error) {
      next(error);
    }
  }
}
