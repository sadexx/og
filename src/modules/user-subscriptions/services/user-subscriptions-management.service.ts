import { MoreThan, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { UserSubscription } from "../schemas";
import { BadRequestException } from "../../../common/exceptions";
import { CoachSubscription } from "../../coach/schemas";
import { CoinTransactionsService } from "../../coin-transactions/services";
import { User } from "../../users/schemas";
import { JwtPayload } from "../../auth/common/dto";
import { ERole } from "../../users/common/enums";
import { UserSubscriptionsService } from "./user-subscriptions.service";
import { PremiumSubscription } from "../../premium-subscription/schemas";
import { findOneOrFail } from "../../../common/utils";

export class UserSubscriptionsManagementService {
  private readonly userRepository: Repository<User>;
  private readonly userSubscriptionRepository: Repository<UserSubscription>;
  private readonly coachSubscriptionRepository: Repository<CoachSubscription>;
  private readonly premiumSubscriptionRepository: Repository<PremiumSubscription>;

  constructor(
    private readonly userSubscriptionsService = new UserSubscriptionsService(),
    private readonly coinTransactionsService = new CoinTransactionsService()
  ) {
    this.userRepository = AppDataSource.getRepository(User);
    this.userSubscriptionRepository = AppDataSource.getRepository(UserSubscription);
    this.coachSubscriptionRepository = AppDataSource.getRepository(CoachSubscription);
    this.premiumSubscriptionRepository = AppDataSource.getRepository(PremiumSubscription);
  }

  /**
   ** Premium subscription
   */

  public async subscribeToPremium(premiumSubscriptionId: string, userId: string): Promise<void> {
    const premiumSubscription = await findOneOrFail(this.premiumSubscriptionRepository, {
      where: { id: premiumSubscriptionId, isActive: true }
    });

    const activeSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        premiumSubscription: { id: premiumSubscription.id },
        endDate: MoreThan(new Date())
      }
    });

    if (activeSubscription) {
      if (activeSubscription.isAutoRenewable) {
        throw new BadRequestException("You already have an active subscription to this premium plan.");
      } else {
        return await this.enableUserSubscriptionAutoRenewal(activeSubscription);
      }
    }

    const existingPremiumSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        premiumSubscription: { isActive: true },
        endDate: MoreThan(new Date())
      },
      relations: { premiumSubscription: true }
    });

    if (existingPremiumSubscription) {
      await this.cancelExistingPremiumSubscription(existingPremiumSubscription);
    }

    await AppDataSource.manager.transaction(async (manager) => {
      await this.coinTransactionsService.deductCoinsFromWallet(manager, userId, premiumSubscription.price);
      await this.userSubscriptionsService.createOrUpdateUserSubscription(manager, userId, premiumSubscription);
    });
  }

  private async cancelExistingPremiumSubscription(existingPremiumSubscription: UserSubscription): Promise<void> {
    await this.userSubscriptionRepository.remove(existingPremiumSubscription);
  }

  /**
   ** Coach subscription
   */

  public async subscribeToCoach(coachId: string, userId: string): Promise<void> {
    const user = await findOneOrFail(this.userRepository, {
      where: { id: userId },
      relations: { userWallet: true, coach: true }
    });

    if (user.coach && user.coach.id === coachId) {
      throw new BadRequestException("You can't subscribe yourself.");
    }

    const coachSubscription = await findOneOrFail(this.coachSubscriptionRepository, {
      where: { coach: { id: coachId } },
      relations: { coach: { user: { userWallet: true } } }
    });

    const activeSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        coachSubscription: { id: coachSubscription.id },
        endDate: MoreThan(new Date())
      }
    });

    if (activeSubscription) {
      if (activeSubscription.isAutoRenewable) {
        throw new BadRequestException("You already subscribed to this coach.");
      } else {
        return await this.enableUserSubscriptionAutoRenewal(activeSubscription);
      }
    }

    const { coach } = coachSubscription;

    await AppDataSource.manager.transaction(async (manager) => {
      await this.coinTransactionsService.transferCoinsBetweenUsers(manager, user, coach.user, coachSubscription.price);
      await this.userSubscriptionsService.createOrUpdateUserSubscription(manager, userId, coachSubscription);
    });
  }

  public async ensureUserSubscribedToCoach(user: JwtPayload, coachId: string): Promise<void> {
    if (user.role === ERole.COACH) {
      const currentUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: { coach: true }
      });

      if (currentUser && currentUser.coach.id === coachId) {
        return;
      }
    }

    const currentDate = new Date();
    const subscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: user.id },
        coachSubscription: {
          coach: { id: coachId }
        },
        endDate: MoreThan(currentDate)
      }
    });

    if (!subscription) {
      throw new BadRequestException("You are not subscribed to this coach.");
    }
  }

  /**
   ** Subscription lifecycle
   */

  public async userSubscriptionUnsubscribe(id: string): Promise<void> {
    const userSubscription = await findOneOrFail(this.userSubscriptionRepository, {
      where: { id }
    });
    await this.userSubscriptionRepository.update(userSubscription.id, {
      isAutoRenewable: false
    });
  }

  private async enableUserSubscriptionAutoRenewal(userSubscription: UserSubscription): Promise<void> {
    await this.userSubscriptionRepository.update(userSubscription.id, {
      isAutoRenewable: true
    });
  }
}
