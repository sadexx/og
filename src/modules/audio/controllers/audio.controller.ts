import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { AudioService } from "../services";

export class AudioController {
  constructor(private readonly audioService = new AudioService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const audio = await this.audioService.getAll();
      res.status(EHttpResponseCode.OK).json(audio);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const audio = await this.audioService.getById(id);
      res.status(EHttpResponseCode.OK).json(audio);
    } catch (error) {
      next(error);
    }
  }
}
