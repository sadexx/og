import { Repository } from "typeorm";
import { PremiumSubscription } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { EPremiumSubscriptionDuration } from "../common/enums";
import { premiumSubscriptionDurationMapping } from "../common/constants";
import { addMonthsToDate } from "../../user-subscriptions/common/helpers";
import { premiumSubscriptionSeedData } from "../common/seed-data";
import { findOneOrFail } from "../../../common/utils";
import { UpdatePremiumSubscriptionDto } from "../common/dto";
import { UserSubscription } from "../../user-subscriptions/schemas";

export class PremiumSubscriptionService {
  protected readonly premiumSubscriptionRepository: Repository<PremiumSubscription>;
  private readonly userSubscriptionRepository: Repository<UserSubscription>;

  constructor() {
    this.premiumSubscriptionRepository = AppDataSource.getRepository(PremiumSubscription);
    this.userSubscriptionRepository = AppDataSource.getRepository(UserSubscription);
  }

  public static async seedPremiumSubscriptionsToDatabase(): Promise<void> {
    const premiumSubscriptionRepository = AppDataSource.getRepository(PremiumSubscription);
    const premiumSubscriptionsCount = await premiumSubscriptionRepository.count();

    if (premiumSubscriptionsCount === 0) {
      await premiumSubscriptionRepository.save(premiumSubscriptionSeedData);
    }
  }

  public async getPremiumSubscriptionsForAdmin(): Promise<PremiumSubscription[]> {
    const premiumSubscriptions = await this.premiumSubscriptionRepository.find({
      select: { id: true, price: true, isActive: true, duration: true }
    });

    return premiumSubscriptions;
  }

  public async getPremiumSubscriptionsForUser(): Promise<PremiumSubscription[]> {
    const premiumSubscriptions = await this.premiumSubscriptionRepository.find({
      select: { id: true, price: true, duration: true },
      where: { isActive: true }
    });

    return premiumSubscriptions;
  }

  public async updatePremiumSubscription(id: string, dto: UpdatePremiumSubscriptionDto): Promise<void> {
    const premiumSubscription = await findOneOrFail(this.premiumSubscriptionRepository, {
      select: { id: true, isActive: true },
      where: { id }
    });
    await this.premiumSubscriptionRepository.update(premiumSubscription.id, dto);

    if (dto.isActive === false && premiumSubscription.isActive === true) {
      await this.disablePremiumSubscriptionAutoRenewal(premiumSubscription.id);
    }
  }

  private async disablePremiumSubscriptionAutoRenewal(id: string): Promise<void> {
    await this.userSubscriptionRepository.update({ premiumSubscription: { id } }, { isAutoRenewable: false });
  }

  public getPremiumSubscriptionEndDate(duration: EPremiumSubscriptionDuration): Date {
    const monthsToAdd = premiumSubscriptionDurationMapping[duration];

    return addMonthsToDate(monthsToAdd);
  }
}
