import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareBody } from "../../common/middleware";
import { UpdateUserDto, UpdateUserPasswordDto } from "./common/dto";
import { UsersController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "./common/enums";

export class UsersRoutes {
  public path = `/${ERoutes.USER}`;
  public router = Router();
  public controller = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.controller.getById.bind(this.controller)
    );
    this.router.get(
      `${this.path}/wallet`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.controller.getUserWallet.bind(this.controller)
    );
    this.router.post(
      `${this.path}/survey-confirmation`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.controller.surveyConfirmation.bind(this.controller)
    );
    this.router.put(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareBody(UpdateUserDto),
      this.controller.update.bind(this.controller)
    );
    this.router.put(
      `${this.path}/update-password`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareBody(UpdateUserPasswordDto),
      this.controller.updateUserPassword.bind(this.controller)
    );
    this.router.delete(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.controller.delete.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/developer`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.controller.deleteDev.bind(this.controller)
    );
    this.router.post(
      `${this.path}/recover-user-account`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.controller.recoverUserAccount.bind(this.controller)
    );
  }
}
