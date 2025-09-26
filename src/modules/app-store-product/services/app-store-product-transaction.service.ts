import { EntityManager, Repository } from "typeorm";
import { AppStoreProduct, AppStoreProductTransaction } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { GetAllAppStoreProductTransactionsDto, ProcessAppStoreProductTransactionDto } from "../common/dto";
import { PaginationQueryOutput } from "../../../common/outputs";
import { CoinTransactionsService } from "../../coin-transactions/services";
import { ESortOrder } from "../../../common/enums";
import { findOneOrFail } from "../../../common/utils";
import { EAppStoreProductType, ECurrencyEnum } from "../common/enums";
import { IAppStoreProductTransaction, IAppStoreWebhookData } from "../common/interfaces";
import { User } from "../../users/schemas";
import { SubscriptionPlanAssignmentService } from "../../subscription-plan/services";
import { AppStoreTransactionVerificationService } from "./app-store-transaction-verification.service";
import { JWSTransactionDecodedPayload } from "@apple/app-store-server-library";
import { BadRequestException } from "../../../common/exceptions";
import { ONE_HUNDRED } from "../../../common/constants";

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

  public async processAppStoreWebhookProductTransaction(webhookData: IAppStoreWebhookData): Promise<void> {
    const decodedNotification = await this.appStoreTransactionVerificationService.verifyAndDecodeWebhook(
      webhookData.signedPayload
    );

    if (!decodedNotification.data || !decodedNotification.data.signedTransactionInfo) {
      throw new BadRequestException("Apple webhook data is missing.");
    }

    await this.processAppStoreProductTransaction({ jwsRepresentation: decodedNotification.data.signedTransactionInfo });
  }

  public async processAppStoreProductTransaction(dto: ProcessAppStoreProductTransactionDto): Promise<void> {
    const payload = await this.appStoreTransactionVerificationService.verifyAndDecodeTransaction(dto.jwsRepresentation);

    await AppDataSource.manager.transaction(async (manager) => {
      if (!payload.appAccountToken) {
        throw new BadRequestException("Missing user identifier in transaction.");
      }

      const existingTransaction = await manager.exists(AppStoreProductTransaction, {
        where: {
          transactionId: payload.transactionId,
          transactionOriginalId: payload.originalTransactionId,
          user: { id: payload.appAccountToken }
        }
      });

      if (existingTransaction) {
        return;
      }

      const appStoreProduct = await findOneOrFail(manager.getRepository(AppStoreProduct), {
        select: { id: true, productType: true, quantity: true, subscriptionPlan: { id: true } },
        where: { productId: payload.productId },
        relations: { subscriptionPlan: true }
      });

      await this.constructAndCreateAppStoreProductTransaction(manager, payload, appStoreProduct);
      await this.processProductPurchase(manager, payload.appAccountToken, appStoreProduct, payload.expiresDate);
    });
  }

  private async constructAndCreateAppStoreProductTransaction(
    manager: EntityManager,
    payload: JWSTransactionDecodedPayload,
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
    payload: JWSTransactionDecodedPayload,
    appStoreProduct: AppStoreProduct
  ): IAppStoreProductTransaction {
    const purchaseDate = new Date(payload.purchaseDate as number);
    const originalPurchaseDate = new Date(payload.originalPurchaseDate as number);

    return {
      transactionId: payload.transactionId as string,
      transactionOriginalId: payload.originalTransactionId as string,
      price: (payload.price as number) / ONE_HUNDRED,
      currency: payload.currency as ECurrencyEnum,
      purchasedQuantity: payload.quantity as number,
      user: { id: payload.appAccountToken } as User,
      purchaseDate,
      originalPurchaseDate,
      appStoreProduct
    };
  }

  private async processProductPurchase(
    manager: EntityManager,
    userId: string,
    appStoreProduct: AppStoreProduct,
    expiresDate?: number
  ): Promise<void> {
    if (appStoreProduct.productType === EAppStoreProductType.COINS) {
      await this.coinTransactionsService.addCoinsToWallet(manager, userId, appStoreProduct.quantity);
    } else if (
      appStoreProduct.productType === EAppStoreProductType.SUBSCRIPTION_PLAN &&
      appStoreProduct.subscriptionPlan &&
      expiresDate
    ) {
      await this.subscriptionPlanAssignmentService.processSubscriptionPurchase(
        manager,
        userId,
        appStoreProduct.subscriptionPlan.id,
        expiresDate
      );
    }
  }
}
