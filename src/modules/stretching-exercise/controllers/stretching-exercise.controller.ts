import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { CreateStretchingExerciseDto, UpdateStretchingExerciseDto } from "../common/dto";
import { plainToInstance } from "class-transformer";
import { StretchingExerciseService } from "../services";

export class StretchingExerciseController {
  constructor(private readonly stretchingExerciseService = new StretchingExerciseService()) {}

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const stretchingExercise = await this.stretchingExerciseService.getById(id);
      res.status(EHttpResponseCode.OK).json(stretchingExercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateStretchingExerciseDto, req.body);
      const stretchingExercise = await this.stretchingExerciseService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(stretchingExercise);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateStretchingExerciseDto, req.body);
      const stretchingExercise = await this.stretchingExerciseService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(stretchingExercise);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const stretchingExercise = await this.stretchingExerciseService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(stretchingExercise);
    } catch (error) {
      next(error);
    }
  }
}
