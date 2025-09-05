import { Request, Response } from "express";
import { WorkoutCategoryService } from "../services/workout-category.service";
import { type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import {
  GetWorkoutInCategoryQueryDto,
  CreateWorkoutCategoryDto,
  UpdateWorkoutCategoryDto,
  WorkoutCategoryIdsDto
} from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";

export class WorkoutCategoryController {
  constructor(private readonly workoutCategoryService = new WorkoutCategoryService()) {}

  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workoutCategory = await this.workoutCategoryService.getAll();
      res.status(EHttpResponseCode.OK).json(workoutCategory);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutCategory = await this.workoutCategoryService.getById(id);
      res.status(EHttpResponseCode.OK).json(workoutCategory);
    } catch (error) {
      next(error);
    }
  }

  public async getWorkoutInWorkoutCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(GetWorkoutInCategoryQueryDto, req.query);
      const workout = await this.workoutCategoryService.getWorkoutInWorkoutCategory(id, dto);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateWorkoutCategoryDto, req.body);
      const workoutCategory = await this.workoutCategoryService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(workoutCategory);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateWorkoutCategoryDto, req.body);
      const workoutCategory = await this.workoutCategoryService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(workoutCategory);
    } catch (error) {
      next(error);
    }
  }

  public async updateWorkoutCategoryOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(WorkoutCategoryIdsDto, req.body);
      const workoutCategory = await this.workoutCategoryService.updateWorkoutCategoryOrder(dto);
      res.status(EHttpResponseCode.CREATED).json(workoutCategory);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutCategory = await this.workoutCategoryService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(workoutCategory);
    } catch (error) {
      next(error);
    }
  }
}
