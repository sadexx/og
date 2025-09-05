import { Request, Response, type NextFunction } from "express";
import { GetAllCustomExerciseDto, CreateCustomExerciseDto, UpdateCustomExerciseDto } from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { CustomExerciseService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class CustomExerciseController {
  constructor(private readonly customExerciseService = new CustomExerciseService()) {}

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(GetAllCustomExerciseDto, req.query);
      const exercise = await this.customExerciseService.getAll(userId, dto);
      res.status(EHttpResponseCode.OK).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(CreateCustomExerciseDto, req.body);
      const exercise = await this.customExerciseService.create(userId, dto);
      res.status(EHttpResponseCode.CREATED).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(UpdateCustomExerciseDto, req.body);
      const exercise = await this.customExerciseService.update(id, userId, dto);
      res.status(EHttpResponseCode.CREATED).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const exercise = await this.customExerciseService.delete(id, userId);
      res.status(EHttpResponseCode.NO_CONTENT).json(exercise);
    } catch (error) {
      next(error);
    }
  }
}
