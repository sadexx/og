import { Request, Response, type NextFunction } from "express";
import { MobileLoginDto, MobileRegistrationDto } from "../common/dto";
import { AuthService } from "../services";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";

export class MobileAuthController {
  constructor(private authService = new AuthService()) {}

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(MobileRegistrationDto, req.body);
      const user = await this.authService.register(dto);
      const userToken = await this.authService.processUserSession(user, dto, req);
      res.status(EHttpResponseCode.OK).json(userToken);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(MobileLoginDto, req.body);
      const user = await this.authService.login(dto);
      const userToken = await this.authService.processUserSession(user, dto, req);
      res.status(EHttpResponseCode.OK).json({
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        isDeactivated: user.isDeactivated
      });
    } catch (error) {
      next(error);
    }
  }
}
