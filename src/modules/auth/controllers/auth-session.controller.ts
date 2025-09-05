import { Request, Response, type NextFunction } from "express";
import { BadRequestException } from "../../../common/exceptions";
import { AuthService } from "../services";
import { EHttpResponseCode } from "../../../common/enums";

export class AuthSessionController {
  constructor(private authService = new AuthService()) {}

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const TOKEN_PARTS_LENGTH = 2;
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        throw new BadRequestException("Authorization header is missing");
      }

      const tokenParts = authorizationHeader.split(" ");

      if (tokenParts.length !== TOKEN_PARTS_LENGTH || tokenParts[0] !== "Bearer") {
        throw new BadRequestException("Invalid Authorization header format");
      }

      const clientRefreshToken = tokenParts[1];
      const userToken = await this.authService.refreshTokens(clientRefreshToken);
      res.status(EHttpResponseCode.OK).json(userToken);
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientRefreshToken: string = req.rawHeaders[1].split(" ")[1];
      await this.authService.logout(clientRefreshToken);
      res.status(EHttpResponseCode.OK).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }
}
