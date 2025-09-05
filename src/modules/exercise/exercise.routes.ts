import { Router } from "express";
import {
  CreateExerciseDto,
  ExercisesIdsDto,
  FilterExerciseQueryDto,
  GetWildCardExerciseQueryDto,
  UpdateExerciseDto
} from "./common/dto";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import {
  validationMiddlewareQuery,
  validationMiddlewareParams,
  validationMiddlewareBody,
  customPassportAuthenticate
} from "../../common/middleware";
import { ExerciseController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class ExerciseRoutes {
  public path = `/${ERoutes.EXERCISES}`;
  public router = Router();
  public controller = new ExerciseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      validationMiddlewareQuery(FilterExerciseQueryDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      `${this.path}/wild-card`,
      validationMiddlewareQuery(GetWildCardExerciseQueryDto, globalQueryTransformer),
      this.controller.getWildCard.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:id`,
      validationMiddlewareParams(GetByIdDto),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateExerciseDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateExerciseDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.controller.delete.bind(this.controller)
    );
    this.router.delete(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(ExercisesIdsDto),
      this.controller.deleteMany.bind(this.controller)
    );
  }
}
