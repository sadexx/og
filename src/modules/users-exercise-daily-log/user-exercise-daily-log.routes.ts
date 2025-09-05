import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareParams } from "../../common/middleware";
import { UserExerciseDailyLogController } from "./controllers";
import { GetByIdDto } from "../../common/dto";

export class UserExerciseDailyLogRoutes {
  public path = `/${ERoutes.EXERCISE_DAILY_LOGS}`;
  public router = Router();
  public controller = new UserExerciseDailyLogController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getExerciseLogsByWorkoutLogId.bind(this.controller)
    );
  }
}
