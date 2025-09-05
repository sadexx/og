import { Request, Response, type NextFunction } from "express";
import { GetAllFavoriteWorkoutQueryDto, CreateFavoriteWorkoutDto, UpdateFavoriteWorkoutDto } from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { FavoriteWorkoutService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class FavoriteWorkoutController {
  constructor(private favoriteWorkoutService = new FavoriteWorkoutService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(GetAllFavoriteWorkoutQueryDto, req.query);
      const favoriteWorkouts = await this.favoriteWorkoutService.getAll(userId, dto);
      res.status(EHttpResponseCode.OK).json(favoriteWorkouts);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const favoriteWorkout = await this.favoriteWorkoutService.getById(userId, id);
      res.status(EHttpResponseCode.OK).json(favoriteWorkout);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(CreateFavoriteWorkoutDto, req.body);
      const favoriteWorkout = await this.favoriteWorkoutService.create(userId, dto);
      res.status(EHttpResponseCode.CREATED).json(favoriteWorkout);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(UpdateFavoriteWorkoutDto, req.body);
      const favoriteWorkout = await this.favoriteWorkoutService.update(userId, id, dto);
      res.status(EHttpResponseCode.OK).json(favoriteWorkout);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const favoriteWorkout = await this.favoriteWorkoutService.delete(userId, id);
      res.status(EHttpResponseCode.NO_CONTENT).json(favoriteWorkout);
    } catch (error) {
      next(error);
    }
  }
}
