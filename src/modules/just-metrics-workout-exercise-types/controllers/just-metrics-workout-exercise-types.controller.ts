import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import {
  CreateJustMetricsWorkoutExerciseTypeDto,
  UpdateJustMetricsWorkoutExerciseTypeDto,
  JustMetricsWorkoutExerciseTypeIdsDto
} from "../common/dto";
import { JustMetricsWorkoutExerciseTypeService } from "../services";

export class JustMetricsWorkoutExerciseTypesController {
  constructor(private justMetricsWorkoutExerciseTypeService = new JustMetricsWorkoutExerciseTypeService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const justMetricsWorkoutExerciseTypes = await this.justMetricsWorkoutExerciseTypeService.getAll();
      res.status(EHttpResponseCode.OK).json(justMetricsWorkoutExerciseTypes);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const justMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeService.getById(id);
      res.status(EHttpResponseCode.OK).json(justMetricsWorkoutExerciseType);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateJustMetricsWorkoutExerciseTypeDto, req.body);
      const justMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(justMetricsWorkoutExerciseType);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateJustMetricsWorkoutExerciseTypeDto, req.body);
      const justMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(justMetricsWorkoutExerciseType);
    } catch (error) {
      next(error);
    }
  }

  public async updateJustMetricsWorkoutExerciseTypesOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(JustMetricsWorkoutExerciseTypeIdsDto, req.body);
      const justMetricsWorkoutExerciseTypes =
        await this.justMetricsWorkoutExerciseTypeService.updateJustMetricsWorkoutExerciseTypesOrder(dto);
      res.status(EHttpResponseCode.CREATED).json(justMetricsWorkoutExerciseTypes);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const justMetricsWorkoutExerciseType = await this.justMetricsWorkoutExerciseTypeService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(justMetricsWorkoutExerciseType);
    } catch (error) {
      next(error);
    }
  }
}
