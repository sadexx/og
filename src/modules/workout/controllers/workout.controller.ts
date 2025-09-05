import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import {
  GetAllWorkoutsDto,
  GetRandomWorkoutQueryDto,
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutExerciseIdsDto
} from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { WorkoutService } from "../services";

export class WorkoutController {
  constructor(private readonly workoutService = new WorkoutService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GetAllWorkoutsDto, req.query);
      const workout = await this.workoutService.getAll(dto);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async getRandomWorkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GetRandomWorkoutQueryDto, req.query);
      const workout = await this.workoutService.getRandomWorkout(dto);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.getById(id);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async getWorkoutExercisesInWorkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutWithExercise = await this.workoutService.getWorkoutExercisesInWorkout(id);
      res.status(EHttpResponseCode.OK).json(workoutWithExercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateWorkoutDto, req.body);
      const workout = await this.workoutService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async copyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.copyById(id);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateWorkoutDto, req.body);
      const workout = await this.workoutService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async updateWorkoutExercisesOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(WorkoutExerciseIdsDto, req.body);
      const workout = await this.workoutService.updateWorkoutExercisesOrder(id, dto);
      res.status(EHttpResponseCode.CREATED).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(workout);
    } catch (error) {
      next(error);
    }
  }
}
