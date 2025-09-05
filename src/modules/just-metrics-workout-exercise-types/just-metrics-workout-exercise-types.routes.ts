import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import {
  CreateJustMetricsWorkoutExerciseTypeDto,
  JustMetricsWorkoutExerciseTypeIdsDto,
  UpdateJustMetricsWorkoutExerciseTypeDto
} from "./common/dto";
import { JustMetricsWorkoutExerciseTypesController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class JustMetricsWorkoutExerciseTypesRoutes {
  public path = `/${ERoutes.JUST_METRICS_WORKOUT_EXERCISE_TYPES}`;
  public router = Router();
  public controller = new JustMetricsWorkoutExerciseTypesController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.controller.getAll.bind(this.controller));
    this.router.get(
      `${this.path}/:id`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateJustMetricsWorkoutExerciseTypeDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(JustMetricsWorkoutExerciseTypeIdsDto),
      this.controller.updateJustMetricsWorkoutExerciseTypesOrder.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateJustMetricsWorkoutExerciseTypeDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.controller.delete.bind(this.controller)
    );
  }
}
