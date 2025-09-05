import { Request, Response, type NextFunction } from "express";
import { DefaultAudioService } from "../services/default-audio.service";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateDefaultAudioDto, UpdateDefaultAudioDto } from "../common/dto";

export class DefaultAudioController {
  constructor(private readonly defaultAudioService = new DefaultAudioService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const audio = await this.defaultAudioService.getAll();
      res.status(EHttpResponseCode.OK).json(audio);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const audio = await this.defaultAudioService.getById(id);
      res.status(EHttpResponseCode.OK).json(audio);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateDefaultAudioDto, req.body);
      const audio = await this.defaultAudioService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(audio);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateDefaultAudioDto, req.body);
      const audio = await this.defaultAudioService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(audio);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const audio = await this.defaultAudioService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(audio);
    } catch (error) {
      next(error);
    }
  }
}
