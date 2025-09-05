import { RequestHandler, Router } from "express";
import passport from "passport";
import { ERoutes } from "../../common/enums";
import { validationMiddlewareBody } from "../../common/middleware";
import { AppleLoginDto, LoginDto, MobileLoginDto, MobileRegistrationDto, RegistrationDto } from "./common/dto";
import {
  AuthSessionController,
  MobileAuthController,
  ThirdPartyAuthController,
  WebAuthController
} from "./controllers";

export class AuthRoutes {
  public path = `/${ERoutes.AUTH}`;
  public router = Router();

  public webAuthController = new WebAuthController();
  public mobileAuthController = new MobileAuthController();
  public authSessionController = new AuthSessionController();
  public thirdPartyAuthController = new ThirdPartyAuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddlewareBody(RegistrationDto),
      this.webAuthController.register.bind(this.webAuthController)
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddlewareBody(LoginDto),
      this.webAuthController.login.bind(this.webAuthController)
    );
    this.router.post(
      `${this.path}/mobile/register`,
      validationMiddlewareBody(MobileRegistrationDto),
      this.mobileAuthController.register.bind(this.mobileAuthController)
    );
    this.router.post(
      `${this.path}/mobile/login`,
      validationMiddlewareBody(MobileLoginDto),
      this.mobileAuthController.login.bind(this.mobileAuthController)
    );
    this.router.post(`${this.path}/refresh`, this.authSessionController.refreshToken.bind(this.authSessionController));
    this.router.post(
      `${this.path}/logout`,
      passport.authenticate("jwt", { session: false }) as RequestHandler,
      this.authSessionController.logout.bind(this.authSessionController)
    );
    this.router.post(
      `${this.path}/apple-login`,
      validationMiddlewareBody(AppleLoginDto),
      this.thirdPartyAuthController.appleLogin.bind(this.thirdPartyAuthController)
    );
  }
}
