import { Router } from "express";
import {
  GetAllWorkoutsDto,
  GetRandomWorkoutQueryDto,
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutExerciseIdsDto
} from "./common/dto";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import {
  validationMiddlewareQuery,
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { WorkoutController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class WorkoutsRoutes {
  public path = `/${ERoutes.WORKOUTS}`;
  public router = Router();
  public controller = new WorkoutController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      validationMiddlewareQuery(GetAllWorkoutsDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}/random`,
      validationMiddlewareQuery(GetRandomWorkoutQueryDto, globalQueryTransformer),
      this.controller.getRandomWorkout.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:id`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:id/workout-exercises`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getWorkoutExercisesInWorkout.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateWorkoutDto),
      this.controller.create.bind(this.controller)
    );
    this.router.post(
      `${this.path}/:id/copy`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.controller.copyById.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateWorkoutDto),
      this.controller.update.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id/workout-exercises/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(WorkoutExerciseIdsDto),
      this.controller.updateWorkoutExercisesOrder.bind(this.controller)
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
