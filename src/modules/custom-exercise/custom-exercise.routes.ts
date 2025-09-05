import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { globalQueryTransformer } from "../../common/helpers";
import {
  customPassportAuthenticate,
  validationMiddlewareBody,
  validationMiddlewareParams,
  validationMiddlewareQuery
} from "../../common/middleware";
import { GetAllCustomExerciseDto, CreateCustomExerciseDto, UpdateCustomExerciseDto } from "./common/dto";
import { CustomExerciseController } from "./controllers";
import { GetByIdDto } from "../../common/dto";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class CustomExerciseRoutes {
  public path = `/${ERoutes.CUSTOM_EXERCISES}`;
  public router = Router();
  public controller = new CustomExerciseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      validationMiddlewareQuery(GetAllCustomExerciseDto, globalQueryTransformer),
      this.controller.getAll.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareBody(CreateCustomExerciseDto),
      this.controller.create.bind(this.controller)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateCustomExerciseDto),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.controller.delete.bind(this.controller)
    );
  }
}
