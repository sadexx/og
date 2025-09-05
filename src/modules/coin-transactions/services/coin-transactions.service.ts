import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { UserWallet } from "../../user-additional-entities/schemas";
import { GetAllCoinTransactionsDto } from "../common/dto";
import { BadRequestException } from "../../../common/exceptions";
import { CoinTransaction } from "../schemas";
import { ETransactionDirection } from "../common/enums";
import { PaginationQueryOutput } from "../../../common/outputs";
import { User } from "../../users/schemas";

export class CoinTransactionsService {
  private readonly coinTransactionRepository: Repository<CoinTransaction>;

  constructor() {
    this.coinTransactionRepository = AppDataSource.getRepository(CoinTransaction);
  }

  public async getAllCoinTransactions(dto: GetAllCoinTransactionsDto): Promise<PaginationQueryOutput<CoinTransaction>> {
    const [transactions, total] = await this.coinTransactionRepository.findAndCount({
      select: {
        user: {
          id: true,
          email: true,
          role: true,
          name: true
        }
      },
      relations: { user: { coach: true } },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit
    });

    return {
      data: transactions,
      pageNumber: dto.page,
      pageCount: Math.ceil(total / dto.limit)
    };
  }

  public async transferCoinsBetweenUsers(
    manager: EntityManager,
    fromUser: User,
    toUser: User,
    amount: number
  ): Promise<void> {
    const fromWallet = fromUser.userWallet;
    const toWallet = toUser.userWallet;

    if (!fromWallet || !toWallet) {
      throw new BadRequestException("One of users don`t have wallet.");
    }

    await this.deductCoinsFromWallet(manager, fromUser.id, amount);
    await this.addCoinsToWallet(manager, toUser.id, amount);
  }

  public async addCoinsToWallet(manager: EntityManager, userId: string, quantity: number): Promise<void> {
    await this.modifyUserWalletAndLogTransaction(manager, userId, quantity, ETransactionDirection.INCOMING);
  }

  public async deductCoinsFromWallet(manager: EntityManager, userId: string, quantity: number): Promise<void> {
    await this.modifyUserWalletAndLogTransaction(manager, userId, -quantity, ETransactionDirection.INCOMING);
  }

  private async modifyUserWalletAndLogTransaction(
    manager: EntityManager,
    userId: string,
    amount: number,
    transactionDirection: ETransactionDirection
  ): Promise<void> {
    await this.createOrUpdateUserWallet(manager, userId, amount);
    await this.logCoinTransaction(manager, userId, amount, transactionDirection);
  }

  private async createOrUpdateUserWallet(manager: EntityManager, userId: string, deltaAmount: number): Promise<void> {
    const userWallet = await manager.findOne(UserWallet, {
      where: { user: { id: userId } }
    });

    if (!userWallet) {
      await this.createUserWallet(manager, userId, deltaAmount);
    } else {
      await this.updateUserWallet(manager, userWallet, deltaAmount);
    }
  }

  private async createUserWallet(manager: EntityManager, userId: string, deltaAmount: number): Promise<void> {
    if (deltaAmount < 0) {
      throw new BadRequestException("Not enough coins to complete operation.");
    }

    const newUserWallet = manager.create(UserWallet, {
      user: { id: userId },
      coinBalance: deltaAmount
    });
    await manager.save(newUserWallet);
  }

  private async updateUserWallet(manager: EntityManager, userWallet: UserWallet, deltaAmount: number): Promise<void> {
    const currentBalance = userWallet.coinBalance ?? 0;
    const newBalance = currentBalance + deltaAmount;

    if (newBalance < 0) {
      throw new BadRequestException("Not enough coins to complete operation.");
    }

    await manager.update(UserWallet, userWallet.id, {
      coinBalance: newBalance
    });
  }

  private async logCoinTransaction(
    manager: EntityManager,
    userId: string,
    amount: number,
    direction: ETransactionDirection
  ): Promise<void> {
    const newTransaction = manager.create(CoinTransaction, {
      user: { id: userId },
      amount,
      direction
    });
    await manager.save(newTransaction);
  }
}
