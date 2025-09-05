import { Repository } from "typeorm";
import { SubscriptionPlan } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { subscriptionPlanSeedData } from "../common/seed-data";
import { BatchUpdateSubscriptionPlansDto } from "../common/dto";
import { ESubscriptionPlanType } from "../common/enums";

export class SubscriptionPlanService {
  protected readonly subscriptionPlanRepository: Repository<SubscriptionPlan>;

  constructor() {
    this.subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
  }

  public static async seedPremiumSubscriptionsToDatabase(): Promise<void> {
    const subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
    const subscriptionPlansCount = await subscriptionPlanRepository.count();

    if (subscriptionPlansCount === 0) {
      await subscriptionPlanRepository.save(subscriptionPlanSeedData);
    }
  }

  public async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await this.subscriptionPlanRepository.find();
  }

  public async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepository.findOne({
      where: { id }
    });
  }

  public async batchUpdateSubscriptionPlans(dto: BatchUpdateSubscriptionPlansDto): Promise<void> {
    const updates = Object.values(ESubscriptionPlanType).filter((plan) => dto[plan]);

    if (updates.length === 0) {
      return;
    }

    for (const subscriptionPlan of updates) {
      const updateData = dto[subscriptionPlan];
      await this.subscriptionPlanRepository.update({ type: subscriptionPlan }, updateData);
    }
  }
}
