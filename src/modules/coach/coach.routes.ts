import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareBody,
  validationMiddlewareParams,
  validationMiddlewareQuery
} from "../../common/middleware";
import { CoachManagementController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { CreateCoachDto, GetAllCoachesDto, UpdateCoachDto } from "./common/dto";
import { ERole } from "../users/common/enums";
import { GetByIdDto } from "../../common/dto";
import { globalQueryTransformer } from "../../common/helpers";

export class CoachRoutes {
  public path = `/${ERoutes.COACHES}`;
  public router = Router();
  public coachManagementController = new CoachManagementController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareQuery(GetAllCoachesDto, globalQueryTransformer),
      this.coachManagementController.getAllCoaches.bind(this.coachManagementController)
    );
    this.router.get(
      `${this.path}/statistics`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      this.coachManagementController.getCoachSubscriptionsStatistics.bind(this.coachManagementController)
    );
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.coachManagementController.getCoachById.bind(this.coachManagementController)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateCoachDto),
      this.coachManagementController.createCoach.bind(this.coachManagementController)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateCoachDto),
      this.coachManagementController.updateCoach.bind(this.coachManagementController)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.coachManagementController.deleteCoach.bind(this.coachManagementController)
    );
  }
}
