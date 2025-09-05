import { Router } from "express";
import {
  GetWorkoutInCategoryQueryDto,
  CreateWorkoutCategoryDto,
  WorkoutCategoryIdsDto,
  UpdateWorkoutCategoryDto
} from "./common/dto";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import {
  validationMiddlewareParams,
  validationMiddlewareQuery,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { WorkoutCategoryController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class WorkoutCategoryRoutes {
  public path = `/${ERoutes.WORKOUT_CATEGORIES}`;
  public router = Router();
  public controller = new WorkoutCategoryController();

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
    this.router.get(
      `${this.path}/:id/workouts`,
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareQuery(GetWorkoutInCategoryQueryDto, globalQueryTransformer),
      this.controller.getWorkoutInWorkoutCategory.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateWorkoutCategoryDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(WorkoutCategoryIdsDto),
      this.controller.updateWorkoutCategoryOrder.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateWorkoutCategoryDto),
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
