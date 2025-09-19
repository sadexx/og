import { EntityManager, Repository } from "typeorm";
import { AppStoreProduct, AppStoreProductTransaction } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { GetAllAppStoreProductTransactionsDto, ProcessAppStoreProductTransactionDto } from "../common/dto";
import { PaginationQueryOutput } from "../../../common/outputs";
import { CoinTransactionsService } from "../../coin-transactions/services";
import { ESortOrder } from "../../../common/enums";
import { AppStoreTransactionVerificationService } from "./app-store-transaction-verification.service";
import { findOneOrFail } from "../../../common/utils";
import { EAppStoreProductType } from "../common/enums";
import { IAppleJwsPayload, IAppStoreProductTransaction } from "../common/interfaces";
import { User } from "../../users/schemas";
import { SubscriptionPlanAssignmentService } from "../../subscription-plan/services";

export class AppStoreProductTransactionService {
  private readonly appStoreProductTransactionRepository: Repository<AppStoreProductTransaction>;

  constructor(
    private readonly appStoreTransactionVerificationService = new AppStoreTransactionVerificationService(),
    private readonly coinTransactionsService = new CoinTransactionsService(),
    private readonly subscriptionPlanAssignmentService = new SubscriptionPlanAssignmentService()
  ) {
    this.appStoreProductTransactionRepository = AppDataSource.getRepository(AppStoreProductTransaction);
  }

  public async getAllAppStoreProductTransactions(
    dto: GetAllAppStoreProductTransactionsDto
  ): Promise<PaginationQueryOutput<AppStoreProductTransaction>> {
    const [appStoreProductTransactions, total] = await this.appStoreProductTransactionRepository.findAndCount({
      select: {
        id: true,
        transactionId: true,
        transactionOriginalId: true,
        price: true,
        currency: true,
        purchasedQuantity: true,
        purchaseDate: true,
        originalPurchaseDate: true,
        createdDate: true,
        appStoreProduct: { id: true, productId: true, name: true },
        user: { id: true, name: true, email: true }
      },
      where: { appStoreProduct: { productId: dto.productId }, user: { id: dto.userId } },
      relations: { appStoreProduct: true, user: true },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: { createdDate: ESortOrder.DESC }
    });

    return {
      data: appStoreProductTransactions,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async processAppStoreProductTransaction(dto: ProcessAppStoreProductTransactionDto): Promise<void> {
    const payload = await this.appStoreTransactionVerificationService.verifyAndDecodeTransactionJWS(
      dto.jwsRepresentation
    );

    console.log("USERID", payload.appAccountToken);

    await AppDataSource.manager.transaction(async (manager) => {
      const existingTransaction = await manager.exists(AppStoreProductTransaction, {
        where: { transactionId: payload.transactionId, user: { id: payload.appAccountToken } }
      });

      if (existingTransaction) {
        return;
      }

      const appStoreProduct = await findOneOrFail(manager.getRepository(AppStoreProduct), {
        where: { productId: payload.productId },
        relations: { subscriptionPlan: true }
      });

      await this.constructAndCreateAppStoreProductTransaction(manager, payload, appStoreProduct);
      await this.processProductPurchase(manager, payload.appAccountToken, appStoreProduct);
    });
  }

  private async processProductPurchase(
    manager: EntityManager,
    userId: string,
    appStoreProduct: AppStoreProduct
  ): Promise<void> {
    if (appStoreProduct.productType === EAppStoreProductType.COINS) {
      await this.coinTransactionsService.addCoinsToWallet(manager, userId, appStoreProduct.quantity);
    } else if (
      appStoreProduct.productType === EAppStoreProductType.SUBSCRIPTION_PLAN &&
      appStoreProduct.subscriptionPlan
    ) {
      await this.subscriptionPlanAssignmentService.processSubscriptionPurchase(
        manager,
        userId,
        appStoreProduct.subscriptionPlan.id
      );
    }
  }

  private async constructAndCreateAppStoreProductTransaction(
    manager: EntityManager,
    payload: IAppleJwsPayload,
    appStoreProduct: AppStoreProduct
  ): Promise<void> {
    const appStoreProductTransactionDto = this.constructAppStoreProductTransactionDto(payload, appStoreProduct);
    await this.createAppStoreProductTransaction(manager, appStoreProductTransactionDto);
  }

  private async createAppStoreProductTransaction(
    manager: EntityManager,
    dto: IAppStoreProductTransaction
  ): Promise<void> {
    const appStoreProductTransaction = manager.create(AppStoreProductTransaction, dto);
    await manager.save(AppStoreProductTransaction, appStoreProductTransaction);
  }

  private constructAppStoreProductTransactionDto(
    payload: IAppleJwsPayload,
    appStoreProduct: AppStoreProduct
  ): IAppStoreProductTransaction {
    return {
      transactionId: payload.transactionId,
      transactionOriginalId: payload.originalTransactionId,
      price: payload.price,
      currency: payload.currency,
      purchasedQuantity: payload.quantity,
      purchaseDate: new Date(payload.purchaseDate),
      originalPurchaseDate: new Date(payload.originalPurchaseDate),
      user: { id: payload.appAccountToken } as User,
      appStoreProduct
    };
  }
}
