import { Request, Response, type NextFunction } from "express";
import { GetAllCoinTransactionsDto } from "../common/dto";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { CoinTransactionsService } from "../services";

export class CoinTransactionController {
  constructor(private readonly coinTransactionsService = new CoinTransactionsService()) {}

  public async getAllCoinTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(GetAllCoinTransactionsDto, req.query);
      const transactions = await this.coinTransactionsService.getAllCoinTransactions(dto);
      res.status(EHttpResponseCode.OK).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}
