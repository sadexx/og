import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { CreateVideoDto, UpdateVideoDto, VideoIdsDto } from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { VideoService } from "../services";

export class VideoController {
  constructor(private videoService = new VideoService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const video = await this.videoService.getAll();
      res.status(EHttpResponseCode.OK).json(video);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.getById(id);
      res.status(EHttpResponseCode.OK).json(video);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateVideoDto, req.body);
      const video = await this.videoService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(video);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateVideoDto, req.body);
      const video = await this.videoService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(video);
    } catch (error) {
      next(error);
    }
  }

  public async updateVideoOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(VideoIdsDto, req.body);
      const video = await this.videoService.updateVideoOrder(dto);
      res.status(EHttpResponseCode.CREATED).json(video);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(video);
    } catch (error) {
      next(error);
    }
  }
}
