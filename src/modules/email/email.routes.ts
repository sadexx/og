import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareBody } from "../../common/middleware";
import {
  EmailVerifyCodeDto,
  EmailAccountRecoveryRequestDto,
  EmailVerifyCodeRecoveryDto,
  EmailAccountRecoveryDto
} from "./common/dto";
import { EmailController } from "./controllers";
import { ERole } from "../users/common/enums";
import { roleGuard } from "../../common/guards";

export class EmailRoutes {
  public path = `/${ERoutes.EMAIL}`;
  public router = Router();
  public controller = new EmailController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/send`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      this.controller.sendCodeToVerifyEmail.bind(this.controller)
    );
    this.router.post(
      `${this.path}/confirm`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareBody(EmailVerifyCodeDto),
      this.controller.verifyEmail.bind(this.controller)
    );
    this.router.post(
      `${this.path}/send-recovery-code`,
      validationMiddlewareBody(EmailAccountRecoveryRequestDto),
      this.controller.sendCodeToAccountRecovery.bind(this.controller)
    );

    this.router.post(
      `${this.path}/verify-recovery-code`,
      validationMiddlewareBody(EmailVerifyCodeRecoveryDto),
      this.controller.verifyCodeAccountRecovery.bind(this.controller)
    );

    this.router.post(
      `${this.path}/verify-account-recovery`,
      validationMiddlewareBody(EmailAccountRecoveryDto),
      this.controller.verifyAccountRecovery.bind(this.controller)
    );
  }
}
