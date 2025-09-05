import { NextFunction, Request, Response } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { JwtPayload } from "../../auth/common/dto";
import { CoachWorkoutExercisesService } from "../services";
import {
  GetCoachExercisesByWorkoutDto,
  CreateCoachWorkoutExerciseDto,
  UpdateCoachWorkoutExerciseDto
} from "../common/dto";

export class CoachWorkoutExercisesController {
  constructor(private coachWorkoutExercisesService = new CoachWorkoutExercisesService()) {}

  public async getCoachExercisesByWorkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GetCoachExercisesByWorkoutDto, req.query);
      const workoutExercises = await this.coachWorkoutExercisesService.getCoachExercisesByWorkout(dto);
      res.status(EHttpResponseCode.OK).json(workoutExercises);
    } catch (error) {
      next(error);
    }
  }

  public async getCoachWorkoutExerciseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workoutExercise = await this.coachWorkoutExercisesService.getCoachWorkoutExerciseById(id);
      res.status(EHttpResponseCode.OK).json(workoutExercise);
    } catch (error) {
      next(error);
    }
  }

  public async createCoachWorkoutExercise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(CreateCoachWorkoutExerciseDto, req.body);
      await this.coachWorkoutExercisesService.createCoachWorkoutExercise(userId, dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }

  public async updateCoachWorkoutExercise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(UpdateCoachWorkoutExerciseDto, req.body);
      await this.coachWorkoutExercisesService.updateCoachWorkoutExercise(id, user, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async deleteCoachWorkoutExercise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      await this.coachWorkoutExercisesService.deleteCoachWorkoutExercise(id, user);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
