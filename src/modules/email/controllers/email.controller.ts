import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import {
  EmailAccountRecoveryDto,
  EmailAccountRecoveryRequestDto,
  EmailVerifyCodeDto,
  EmailVerifyCodeRecoveryDto
} from "../common/dto";
import { EmailService } from "../services";

export class EmailController {
  constructor(private emailService = new EmailService()) {}

  public async sendCodeToVerifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      await this.emailService.sendCodeToVerifyEmail(userId);
      res.status(EHttpResponseCode.OK).json({ message: "Email sent" });
    } catch (error) {
      next(error);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as JwtPayload).id;
      const dto = plainToInstance(EmailVerifyCodeDto, req.body);
      await this.emailService.verifyEmail(userId, dto);
      res.status(EHttpResponseCode.OK).json({ message: "Email confirmed" });
    } catch (error) {
      next(error);
    }
  }

  public async sendCodeToAccountRecovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(EmailAccountRecoveryRequestDto, req.body);
      await this.emailService.sendCodeToAccountRecovery(dto);
      res.status(EHttpResponseCode.OK).json({ message: "Recovery code sent" });
    } catch (error) {
      next(error);
    }
  }

  public async verifyCodeAccountRecovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(EmailVerifyCodeRecoveryDto, req.body);
      await this.emailService.verifyCodeAccountRecovery(dto);
      res.status(EHttpResponseCode.OK).json({ message: "Code verified" });
    } catch (error) {
      next(error);
    }
  }

  public async verifyAccountRecovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(EmailAccountRecoveryDto, req.body);
      await this.emailService.verifyAccountRecovery(dto);
      res.status(EHttpResponseCode.OK).json({ message: "Account recovery successful" });
    } catch (error) {
      next(error);
    }
  }
}
