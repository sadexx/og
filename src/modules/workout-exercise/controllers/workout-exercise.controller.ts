import { Request, Response, type NextFunction } from "express";
import { CreateWorkoutExerciseDto, UpdateWorkoutExerciseDto } from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { WorkoutExerciseService } from "../services";

export class WorkoutExerciseController {
  constructor(private readonly workoutExerciseService = new WorkoutExerciseService()) {}

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutExercise = await this.workoutExerciseService.getById(id);
      res.status(EHttpResponseCode.OK).json(workoutExercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateWorkoutExerciseDto, req.body);
      const workoutExercise = await this.workoutExerciseService.create(dto);
      res.status(EHttpResponseCode.CREATED).json(workoutExercise);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateWorkoutExerciseDto, req.body);
      const workoutExercise = await this.workoutExerciseService.update(id, dto);
      res.status(EHttpResponseCode.CREATED).json(workoutExercise);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutExercise = await this.workoutExerciseService.delete(id);
      res.status(EHttpResponseCode.NO_CONTENT).json(workoutExercise);
    } catch (error) {
      next(error);
    }
  }
}
