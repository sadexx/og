import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareParams } from "../../common/middleware";
import { CustomWorkoutController } from "./controllers";
import { GetByIdDto } from "../../common/dto";

export class CustomWorkoutRoutes {
  public path = `/${ERoutes.CUSTOM_WORKOUTS}`;
  public router = Router();
  public controller = new CustomWorkoutController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/:id/custom-workout-exercises`,
      customPassportAuthenticate,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getCustomWorkoutExercisesInCustomWorkout.bind(this.controller)
    );
  }
}
