import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { CreateCustomStretchingDto, UpdateCustomStretchingDto } from "../common/dto";
import { CustomStretchingService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class CustomStretchingController {
  constructor(private readonly customStretchingService = new CustomStretchingService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const stretchers = await this.customStretchingService.getAll(userId);
      res.status(EHttpResponseCode.OK).json(stretchers);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const stretching = await this.customStretchingService.getById(id, userId);
      res.status(EHttpResponseCode.OK).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async getCustomStretchingExercisesInCustomStretches(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const workoutWithExercise = await this.customStretchingService.getCustomStretchingExercisesInCustomStretches(
        id,
        userId
      );
      res.status(EHttpResponseCode.OK).json(workoutWithExercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(CreateCustomStretchingDto, req.body);
      const stretching = await this.customStretchingService.create(userId, dto);
      res.status(EHttpResponseCode.CREATED).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(UpdateCustomStretchingDto, req.body);
      const stretching = await this.customStretchingService.update(id, userId, dto);
      res.status(EHttpResponseCode.CREATED).json(stretching);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const stretching = await this.customStretchingService.delete(id, userId);
      res.status(EHttpResponseCode.NO_CONTENT).json(stretching);
    } catch (error) {
      next(error);
    }
  }
}
