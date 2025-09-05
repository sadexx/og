import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { CustomWorkoutService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class CustomWorkoutController {
  constructor(private customWorkoutService = new CustomWorkoutService()) {}

  public async getCustomWorkoutExercisesInCustomWorkout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req.user as JwtPayload).id;
      const workout = await this.customWorkoutService.getCustomWorkoutExercisesInCustomWorkout(id, userId);
      res.status(EHttpResponseCode.OK).json(workout);
    } catch (error) {
      next(error);
    }
  }
}
