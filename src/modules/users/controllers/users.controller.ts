import { Request, Response, type NextFunction } from "express";
import { JwtPayload } from "../../auth/common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto, UpdateUserPasswordDto } from "../common/dto";
import { UserService } from "../services";

export class UsersController {
  constructor(private userService = new UserService()) {}

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      const user = await this.userService.getById(currentUser.id);
      res.status(EHttpResponseCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async getUserWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      const userWallet = await this.userService.getUserWallet(currentUser.id);
      res.status(EHttpResponseCode.OK).json(userWallet);
    } catch (error) {
      next(error);
    }
  }

  public async surveyConfirmation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      const confirmation = await this.userService.surveyConfirmation(currentUser.id);
      res.status(EHttpResponseCode.CREATED).json(confirmation);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      const dto = plainToInstance(UpdateUserDto, req.body);
      const updatedUser = await this.userService.update(currentUser.id, dto);
      res.status(EHttpResponseCode.CREATED).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  public async updateUserPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      const dto = plainToInstance(UpdateUserPasswordDto, req.body);
      await this.userService.updateUserPassword(currentUser.id, dto);
      res.status(EHttpResponseCode.CREATED).json({
        message: "User password updated"
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      await this.userService.delete(currentUser.id);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }

  public async deleteDev(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      await this.userService.deleteDev(currentUser.id);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }

  public async recoverUserAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = req.user as JwtPayload;
      await this.userService.recoverUserAccount(currentUser.id);
      res.status(EHttpResponseCode.OK).json({
        message: "User account recovered"
      });
    } catch (error) {
      next(error);
    }
  }
}
