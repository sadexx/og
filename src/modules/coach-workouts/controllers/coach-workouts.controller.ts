import { NextFunction, Request, Response } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";

import { JwtPayload } from "../../auth/common/dto";
import { WorkoutExerciseIdsDto } from "../../workout/common/dto";
import { CoachWorkoutsService } from "../services";
import {
  GetVerifiedCoachWorkoutsDto,
  GetUnverifiedCoachWorkoutsDto,
  CreateCoachWorkoutDto,
  UpdateCoachWorkoutDto,
  CoachWorkoutManualDecisionDto
} from "../common/dto";

export class CoachWorkoutsController {
  constructor(private coachWorkoutsService = new CoachWorkoutsService()) {}

  public async getVerifiedCoachWorkouts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(GetVerifiedCoachWorkoutsDto, req.query);
      const workouts = await this.coachWorkoutsService.getVerifiedCoachWorkouts(user, dto);
      res.status(EHttpResponseCode.OK).json(workouts);
    } catch (error) {
      next(error);
    }
  }

  public async getUnverifiedCoachWorkouts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(GetUnverifiedCoachWorkoutsDto, req.query);
      const workouts = await this.coachWorkoutsService.getUnverifiedCoachWorkouts(user, dto);
      res.status(EHttpResponseCode.OK).json(workouts);
    } catch (error) {
      next(error);
    }
  }

  public async getCoachWorkoutById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const workout = await this.coachWorkoutsService.getCoachWorkoutById(id);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async createCoachWorkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(CreateCoachWorkoutDto, req.body);
      await this.coachWorkoutsService.createCoachWorkout(userId, dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }

  public async updateCoachWorkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(UpdateCoachWorkoutDto, req.body);
      await this.coachWorkoutsService.updateCoachWorkout(id, user, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async coachWorkoutManualDecision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(CoachWorkoutManualDecisionDto, req.body);
      await this.coachWorkoutsService.coachWorkoutManualDecision(id, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async updateCoachWorkoutExercisesOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(WorkoutExerciseIdsDto, req.body);
      const workout = await this.coachWorkoutsService.updateCoachWorkoutExercisesOrder(id, user, dto);
      res.status(EHttpResponseCode.CREATED).json(workout);
    } catch (error) {
      next(error);
    }
  }

  public async deleteCoachWorkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      await this.coachWorkoutsService.deleteCoachWorkout(id, user);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
