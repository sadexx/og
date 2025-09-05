import { Request, Response, type NextFunction } from "express";
import {
  CreateExerciseDto,
  ExercisesIdsDto,
  FilterExerciseQueryDto,
  GetWildCardExerciseQueryDto,
  UpdateExerciseDto
} from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { ExerciseService } from "../services";

export class ExerciseController {
  constructor(private readonly exerciseService = new ExerciseService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(FilterExerciseQueryDto, req.query);
      const exercise = await this.exerciseService.getAll(dto);
      res.status(EHttpResponseCode.OK).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const exercise = await this.exerciseService.getById(id);
      res.status(EHttpResponseCode.OK).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async getWildCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GetWildCardExerciseQueryDto, req.query);
      const exercise = await this.exerciseService.getWildCard(dto);
      res.status(EHttpResponseCode.OK).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateExerciseDto, req.body);
      const exercise = await this.exerciseService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateExerciseDto, req.body);
      const exercise = await this.exerciseService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const exercise = await this.exerciseService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(ExercisesIdsDto, req.body);
      await this.exerciseService.deleteMany(dto);
      res.status(EHttpResponseCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
