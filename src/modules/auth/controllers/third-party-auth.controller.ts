import { Request, Response, type NextFunction } from "express";
import { AppleLoginDto } from "../common/dto";
import { AppleAuthService, AuthService } from "../services";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";

export class ThirdPartyAuthController {
  constructor(
    private authService = new AuthService(),
    private appleAuthService = new AppleAuthService()
  ) {}

  public async appleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(AppleLoginDto, req.body);
      const user = await this.appleAuthService.processAppleLogin(dto);
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
