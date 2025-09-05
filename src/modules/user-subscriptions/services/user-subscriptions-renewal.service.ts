import { EntityManager, LessThan } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { UserSubscription } from "../schemas";
import { logger } from "../../../setup/logger";
import { EmailService } from "../../email/services";
import { CoinTransactionsService } from "../../coin-transactions/services";
import { UserSubscriptionsService } from "./user-subscriptions.service";
import { TSubscriptionEntity } from "../common/types";
import { UserWallet } from "../../user-additional-entities/schemas";

export class UserSubscriptionsRenewalService {
  constructor(
    private readonly userSubscriptionsService = new UserSubscriptionsService(),
    private readonly emailService = new EmailService(),
    private readonly coinTransactionsService = new CoinTransactionsService()
  ) {}

  public async renewUserSubscriptions(): Promise<void> {
    await AppDataSource.manager.transaction(async (manager) => {
      const currentDate = new Date();
      const expiredSubscriptions = await manager.find(UserSubscription, {
        where: { endDate: LessThan(currentDate), lastRenewedAt: LessThan(currentDate), isAutoRenewable: true },
        relations: {
          user: { userWallet: true },
          coachSubscription: { coach: { user: { userWallet: true } } },
          premiumSubscription: true
        }
      });
      logger.info(`Found ${expiredSubscriptions.length} expired subscriptions to renew.`);

      for (const subscription of expiredSubscriptions) {
        await this.renewSingleUserSubscription(manager, subscription);
      }
    });
  }

  private async renewSingleUserSubscription(manager: EntityManager, subscription: UserSubscription): Promise<void> {
    const { userWallet } = subscription.user;

    try {
      if (subscription.premiumSubscription) {
        await this.renewPremiumSubscription(manager, subscription, userWallet);
      } else {
        await this.renewCoachSubscription(manager, subscription, userWallet);
      }
    } catch (error) {
      logger.error(`Failed to renew subscription ${subscription.id}:`, error);
      await this.handleFailedRenewal(manager, subscription);
    }
  }

  private async renewPremiumSubscription(
    manager: EntityManager,
    subscription: UserSubscription,
    userWallet: UserWallet
  ): Promise<void> {
    const { premiumSubscription } = subscription;

    if (!premiumSubscription) {
      return;
    }

    if (userWallet.coinBalance < premiumSubscription.price) {
      logger.warn(`User ${subscription.user.id} has insufficient balance to renew subscription.`);
      await this.handleFailedRenewal(manager, subscription);

      return;
    }

    await this.coinTransactionsService.deductCoinsFromWallet(manager, subscription.user.id, premiumSubscription.price);
    await this.extendSubscriptionPeriod(manager, subscription.id, premiumSubscription);
  }

  private async renewCoachSubscription(
    manager: EntityManager,
    subscription: UserSubscription,
    userWallet: UserWallet
  ): Promise<void> {
    const { coachSubscription } = subscription;

    if (!coachSubscription) {
      return;
    }

    if (userWallet.coinBalance < coachSubscription.price) {
      logger.warn(`User ${subscription.user.id} has insufficient balance to renew subscription.`);
      await this.handleFailedRenewal(manager, subscription);

      return;
    }

    await this.coinTransactionsService.transferCoinsBetweenUsers(
      manager,
      subscription.user,
      coachSubscription.coach.user,
      coachSubscription.price
    );
    await this.extendSubscriptionPeriod(manager, subscription.id, coachSubscription);
  }

  private async extendSubscriptionPeriod(
    manager: EntityManager,
    subscriptionId: string,
    subscriptionEntity: TSubscriptionEntity
  ): Promise<void> {
    const newEndDate = this.userSubscriptionsService.determineSubscriptionEndDate(subscriptionEntity);
    await manager.update(UserSubscription, subscriptionId, {
      endDate: newEndDate,
      lastRenewedAt: new Date()
    });
  }

  private async handleFailedRenewal(manager: EntityManager, subscription: UserSubscription): Promise<void> {
    await manager.remove(UserSubscription, subscription);
    await this.emailService.sendFailedRenewalEmail(subscription.user);
    logger.info(`Removed failed renewal subscription for user ${subscription.user.id}`);
  }
}
