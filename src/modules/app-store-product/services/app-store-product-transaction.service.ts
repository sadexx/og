import { EntityManager, In, Repository } from "typeorm";
import { AppStoreProduct, AppStoreProductTransaction } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import {
  AppStoreProductTransactionDto,
  GetAllAppStoreProductTransactionsDto,
  ProcessAppStoreProductTransactionsDto
} from "../common/dto";
import { PaginationQueryOutput } from "../../../common/outputs";
import { BadRequestException } from "../../../common/exceptions";
import { CoinTransactionsService } from "../../coin-transactions/services";
import { ESortOrder } from "../../../common/enums";

export class AppStoreProductTransactionService {
  private readonly appStoreProductRepository: Repository<AppStoreProduct>;
  private readonly appStoreProductTransactionRepository: Repository<AppStoreProductTransaction>;

  constructor(private readonly coinTransactionsService = new CoinTransactionsService()) {
    this.appStoreProductRepository = AppDataSource.getRepository(AppStoreProduct);
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
        appStoreProduct: {
          id: true,
          productId: true,
          name: true
        },
        user: {
          id: true,
          name: true,
          email: true
        }
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

  public async processAppStoreProductTransactions(
    userId: string,
    dto: ProcessAppStoreProductTransactionsDto
  ): Promise<void> {
    const uniqueProductIds = [...new Set(dto.transactions.map((t) => t.productId))];
    const appStoreProducts = await this.appStoreProductRepository.find({
      select: { id: true, quantity: true, productId: true },
      where: { productId: In(uniqueProductIds) }
    });

    if (appStoreProducts.length !== uniqueProductIds.length) {
      throw new BadRequestException("Some of the provided productIds do not exist.");
    }

    await AppDataSource.manager.transaction(async (manager) => {
      for (const product of appStoreProducts) {
        const productTransactions = dto.transactions.filter(
          (transaction) => transaction.productId === product.productId
        );

        await this.upsertAppStoreProductTransactions(manager, userId, product, productTransactions);
      }
    });
  }

  private async upsertAppStoreProductTransactions(
    manager: EntityManager,
    userId: string,
    appStoreProduct: AppStoreProduct,
    transactions: AppStoreProductTransactionDto[]
  ): Promise<void> {
    const uniqueTransactions = transactions.filter(
      (transaction, index, self) => index === self.findIndex((t) => t.transactionId === transaction.transactionId)
    );

    const transactionIds = uniqueTransactions.map((transaction) => transaction.transactionId);
    const existingTransactions = await manager.find(AppStoreProductTransaction, {
      select: { id: true, transactionId: true },
      where: { transactionId: In(transactionIds), user: { id: userId } }
    });

    const existingTransactionsMap = new Map(
      existingTransactions.map((transaction) => [transaction.transactionId, transaction.id])
    );

    for (const transactionDto of uniqueTransactions) {
      const existingTransactionId = existingTransactionsMap.get(transactionDto.transactionId);

      if (existingTransactionId) {
        await this.updateAppStoreProductTransaction(manager, existingTransactionId, transactionDto);
      } else {
        await this.createAppStoreProductTransaction(manager, userId, appStoreProduct, transactionDto);
        await this.coinTransactionsService.addCoinsToWallet(manager, userId, appStoreProduct.quantity);
      }
    }
  }

  private async updateAppStoreProductTransaction(
    manager: EntityManager,
    transactionId: string,
    dto: AppStoreProductTransactionDto
  ): Promise<void> {
    await manager.update(AppStoreProductTransaction, transactionId, {
      transactionId: dto.transactionId,
      transactionOriginalId: dto.transactionOriginalId,
      price: dto.price,
      currency: dto.currency,
      purchasedQuantity: dto.purchasedQuantity,
      purchaseDate: dto.purchaseDate,
      originalPurchaseDate: dto.originalPurchaseDate
    });
  }

  private async createAppStoreProductTransaction(
    manager: EntityManager,
    userId: string,
    appStoreProduct: AppStoreProduct,
    dto: AppStoreProductTransactionDto
  ): Promise<void> {
    const newTransaction = manager.create(AppStoreProductTransaction, {
      transactionId: dto.transactionId,
      transactionOriginalId: dto.transactionOriginalId,
      price: dto.price,
      currency: dto.currency,
      purchasedQuantity: dto.purchasedQuantity,
      purchaseDate: dto.purchaseDate,
      originalPurchaseDate: dto.originalPurchaseDate,
      appStoreProduct,
      user: { id: userId }
    });
    await manager.save(newTransaction);
  }
}
