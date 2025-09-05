import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateStretchingDto, UpdateStretchingDto, StretchingExerciseIdsDto, StretchingIdsDto } from "../common/dto";
import { StretchingService } from "../services";

export class StretchingController {
  constructor(private readonly stretchingService = new StretchingService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stretchers = await this.stretchingService.getAll();
      res.status(EHttpResponseCode.OK).json(stretchers);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const stretching = await this.stretchingService.getById(id);
      res.status(EHttpResponseCode.OK).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async getStretchingExercisesInStretching(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutWithExercise = await this.stretchingService.getStretchingExercisesInStretching(id);
      res.status(EHttpResponseCode.OK).json(workoutWithExercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateStretchingDto, req.body);
      const stretching = await this.stretchingService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateStretchingDto, req.body);
      const stretching = await this.stretchingService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async updateStretchingExercisesOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(StretchingExerciseIdsDto, req.body);
      const stretching = await this.stretchingService.updateStretchingExercisesOrder(id, dto);
      res.status(EHttpResponseCode.CREATED).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async updateStretchersOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(StretchingIdsDto, req.body);
      const stretchers = await this.stretchingService.updateStretchersOrder(dto);
      res.status(EHttpResponseCode.CREATED).json(stretchers);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const stretching = await this.stretchingService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(stretching);
    } catch (error) {
      next(error);
    }
  }
}
