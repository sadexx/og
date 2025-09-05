import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { AppStoreProductTransactionService } from "../services";
import { GetAllAppStoreProductTransactionsDto, ProcessAppStoreProductTransactionsDto } from "../common/dto";
import { JwtPayload } from "../../auth/common/dto";

export class AppStoreProductTransactionController {
  constructor(private appStoreProductTransactionService = new AppStoreProductTransactionService()) {}

  public async getAllAppStoreProductTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GetAllAppStoreProductTransactionsDto, req.query);
      const appStoreProductTransactions =
        await this.appStoreProductTransactionService.getAllAppStoreProductTransactions(dto);
      res.status(EHttpResponseCode.OK).json(appStoreProductTransactions);
    } catch (error) {
      next(error);
    }
  }

  public async processAppStoreProductTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(ProcessAppStoreProductTransactionsDto, req.body);
      await this.appStoreProductTransactionService.processAppStoreProductTransactions(user.id, dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }
}
