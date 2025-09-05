import { Router } from "express";
import { ERoutes } from "../../common/enums";
import { customPassportAuthenticate, validationMiddlewareQuery } from "../../common/middleware";
import { GetAllCoinTransactionsDto } from "./common/dto";
import { CoinTransactionController } from "./controllers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { globalQueryTransformer } from "../../common/helpers";

export class CoinTransactionsRoutes {
  public path = `/${ERoutes.COIN_TRANSACTIONS}`;
  public router = Router();
  public coinTransactionController = new CoinTransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(GetAllCoinTransactionsDto, globalQueryTransformer),
      this.coinTransactionController.getAllCoinTransactions.bind(this.coinTransactionController)
    );
  }
}
