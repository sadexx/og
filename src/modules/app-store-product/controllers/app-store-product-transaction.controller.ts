import { Request, Response, type NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { EHttpResponseCode } from "../../../common/enums";
import { AppStoreProductTransactionService } from "../services";
import { GetAllAppStoreProductTransactionsDto, ProcessAppStoreProductTransactionDto } from "../common/dto";

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

  public async processAppStoreProductTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(ProcessAppStoreProductTransactionDto, req.body);
      await this.appStoreProductTransactionService.processAppStoreProductTransaction(dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }
}
