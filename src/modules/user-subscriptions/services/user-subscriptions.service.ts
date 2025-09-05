import { EntityManager, IsNull, Not, Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { UserSubscription } from "../schemas";
import { addMonthsToDate } from "../common/helpers";
import { TSubscriptionEntity } from "../common/types";
import { PremiumSubscription } from "../../premium-subscription/schemas";
import { PremiumSubscriptionService } from "../../premium-subscription/services";
import { ICreateUserSubscription } from "../common/interfaces";
import { User } from "../../users/schemas";
import { CoachSubscription } from "../../coach/schemas";

export class UserSubscriptionsService {
  private readonly userSubscriptionRepository: Repository<UserSubscription>;

  constructor(private readonly premiumSubscriptionService = new PremiumSubscriptionService()) {
    this.userSubscriptionRepository = AppDataSource.getRepository(UserSubscription);
  }

  public async getUserCoachSubscriptions(userId: string): Promise<UserSubscription[]> {
    const userCoachSubscriptions = await this.userSubscriptionRepository.find({
      select: {
        id: true,
        endDate: true,
        isAutoRenewable: true,
        coachSubscription: {
          id: true,
          price: true,
          coach: { id: true, description: true, coverImageUrl: true, user: { id: true, name: true } }
        }
      },
      where: {
        user: { id: userId },
        coachSubscription: { id: Not(IsNull()) }
      },
      relations: { coachSubscription: { coach: { user: true } } }
    });

    return userCoachSubscriptions;
  }

  public async createOrUpdateUserSubscription(
    manager: EntityManager,
    userId: string,
    subscriptionEntity: TSubscriptionEntity
  ): Promise<void> {
    const existingSubscription = await manager.findOne(UserSubscription, {
      where: [
        { user: { id: userId }, coachSubscription: { id: subscriptionEntity.id } },
        { user: { id: userId }, premiumSubscription: { id: subscriptionEntity.id } }
      ]
    });

    if (existingSubscription) {
      await this.extendSubscriptionPeriod(manager, existingSubscription.id, subscriptionEntity);
    } else {
      await this.constructAndCreateUserSubscription(manager, userId, subscriptionEntity);
    }
  }

  private async extendSubscriptionPeriod(
    manager: EntityManager,
    id: string,
    subscriptionEntity: TSubscriptionEntity
  ): Promise<void> {
    const newEndDate = this.determineSubscriptionEndDate(subscriptionEntity);
    await manager.update(UserSubscription, id, {
      endDate: newEndDate,
      lastRenewedAt: new Date()
    });
  }

  private async constructAndCreateUserSubscription(
    manager: EntityManager,
    userId: string,
    subscriptionEntity: TSubscriptionEntity
  ): Promise<UserSubscription> {
    const newUserSubscription = this.constructUserSubscriptionDto(userId, subscriptionEntity);
    const savedSubscription = await this.createUserSubscription(manager, newUserSubscription);

    return savedSubscription;
  }

  private constructUserSubscriptionDto(
    userId: string,
    subscriptionEntity: TSubscriptionEntity
  ): ICreateUserSubscription {
    const determinedEndDate = this.determineSubscriptionEndDate(subscriptionEntity);

    return {
      endDate: determinedEndDate,
      lastRenewedAt: new Date(),
      isAutoRenewable: true,
      user: { id: userId } as User,
      coachSubscription: subscriptionEntity instanceof CoachSubscription ? subscriptionEntity : null,
      premiumSubscription: subscriptionEntity instanceof PremiumSubscription ? subscriptionEntity : null
    };
  }

  private async createUserSubscription(
    manager: EntityManager,
    dto: ICreateUserSubscription
  ): Promise<UserSubscription> {
    const newUserSubscriptionDto = manager.create(UserSubscription, dto);
    const savedUserSubscription = await manager.save(UserSubscription, newUserSubscriptionDto);

    return savedUserSubscription;
  }

  public determineSubscriptionEndDate(subscriptionEntity: TSubscriptionEntity): Date {
    if (subscriptionEntity instanceof PremiumSubscription) {
      return this.premiumSubscriptionService.getPremiumSubscriptionEndDate(subscriptionEntity.duration);
    }

    return addMonthsToDate(1);
  }
}
