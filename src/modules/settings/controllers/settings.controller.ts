import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { UpdateSettingsDto } from "../common/dto";
import { SettingsService } from "../services";

export class SettingsController {
  constructor(private readonly settingsService = new SettingsService()) {}

  public async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.settingsService.getSettings();
      res.status(EHttpResponseCode.OK).json(settings);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(UpdateSettingsDto, req.body);
      const settings = await this.settingsService.update(dto);
      res.status(EHttpResponseCode.CREATED).json(settings);
    } catch (error) {
      next(error);
    }
  }
}
