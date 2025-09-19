import { Router } from "express";
import { AppStoreProductController, AppStoreProductTransactionController } from "./controllers";
import { ERoutes } from "../../common/enums";
import {
  validationMiddlewareParams,
  validationMiddlewareBody,
  validationMiddlewareQuery,
  customPassportAuthenticate
} from "../../common/middleware";
import { GetByIdDto } from "../../common/dto";
import {
  CreateAppStoreProductDto,
  GetAllAppStoreProductTransactionsDto,
  ProcessAppStoreProductTransactionDto,
  UpdateAppStoreProductDto
} from "./common/dto";
import { globalQueryTransformer } from "../../common/helpers";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";

export class AppStoreProductRoutes {
  public path = `/${ERoutes.APP_STORE_PRODUCTS}`;
  public router = Router();
  public appStoreProductController = new AppStoreProductController();
  public appStoreProductTransactionsController = new AppStoreProductTransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      this.appStoreProductController.getAllAppStoreProducts.bind(this.appStoreProductController)
    );
    this.router.get(
      `${this.path}/transactions`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareQuery(GetAllAppStoreProductTransactionsDto, globalQueryTransformer),
      this.appStoreProductTransactionsController.getAllAppStoreProductTransactions.bind(
        this.appStoreProductTransactionsController
      )
    );
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.appStoreProductController.getAppStoreProductById.bind(this.appStoreProductController)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareBody(CreateAppStoreProductDto),
      this.appStoreProductController.createAppStoreProduct.bind(this.appStoreProductController)
    );
    this.router.post(
      `${this.path}/transaction/verify`,
      customPassportAuthenticate,
      roleGuard([ERole.USER, ERole.COACH]),
      validationMiddlewareBody(ProcessAppStoreProductTransactionDto),
      this.appStoreProductTransactionsController.processAppStoreProductTransaction.bind(
        this.appStoreProductTransactionsController
      )
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateAppStoreProductDto),
      this.appStoreProductController.updateAppStoreProduct.bind(this.appStoreProductController)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      this.appStoreProductController.deleteAppStoreProduct.bind(this.appStoreProductController)
    );
  }
}
