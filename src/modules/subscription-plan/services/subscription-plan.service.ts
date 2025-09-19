import { Repository } from "typeorm";
import { SubscriptionPlan } from "../schemas";
import { AppDataSource } from "../../../common/configs/db.config";
import { subscriptionPlanSeedData } from "../common/seed-data";
import { BatchUpdateSubscriptionPlansDto } from "../common/dto";
import { ESubscriptionPlanType } from "../common/enums";
import { findOneOrFail } from "../../../common/utils";
import { redisClient } from "../../../common/configs/redis.config";
import {
  NUMBER_OF_DAYS_IN_WEEK,
  NUMBER_OF_HOURS_IN_DAY,
  NUMBER_OF_MINUTES_IN_HOUR,
  NUMBER_OF_SECONDS_IN_MINUTE
} from "../../../common/constants";
import { SubscriptionPlanAssignmentService } from "./subscription-plan-assignment.service";

export class SubscriptionPlanService {
  private static instance: SubscriptionPlanService;
  private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>;

  constructor(private readonly subscriptionPlanAssignmentService = new SubscriptionPlanAssignmentService()) {
    this.subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
  }

  public static getInstance(): SubscriptionPlanService {
    if (!SubscriptionPlanService.instance) {
      SubscriptionPlanService.instance = new SubscriptionPlanService();
    }

    return SubscriptionPlanService.instance;
  }

  public static async seedPremiumSubscriptionsToDatabase(): Promise<void> {
    const subscriptionPlanRepository = AppDataSource.getRepository(SubscriptionPlan);
    const subscriptionPlansCount = await subscriptionPlanRepository.count();

    if (subscriptionPlansCount === 0) {
      await subscriptionPlanRepository.save(subscriptionPlanSeedData);
    }
  }

  public async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const cacheKey = "subscription-plans";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as SubscriptionPlan[];
    }

    const subscriptionPlans = await this.subscriptionPlanRepository.find();

    const cacheTtl =
      NUMBER_OF_DAYS_IN_WEEK * NUMBER_OF_HOURS_IN_DAY * NUMBER_OF_MINUTES_IN_HOUR * NUMBER_OF_SECONDS_IN_MINUTE;
    await redisClient.set(cacheKey, JSON.stringify(subscriptionPlans), "EX", cacheTtl);

    return subscriptionPlans;
  }

  public async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | null> {
    return await findOneOrFail(this.subscriptionPlanRepository, {
      where: { id }
    });
  }

  public async getUserSubscriptionPlan(userId: string): Promise<SubscriptionPlan> {
    const subscriptionPlans = await this.getSubscriptionPlans();
    const subscriptionPlanType = await this.subscriptionPlanAssignmentService.getSubscriptionAssignmentPlanType(userId);

    const subscriptionPlan = subscriptionPlans.find((plan) => plan.type === subscriptionPlanType);

    if (!subscriptionPlan) {
      await this.subscriptionPlanAssignmentService.invalidateSubscriptionPlanTypeCache(userId);
      throw new Error(`Subscription plan not found for type: ${subscriptionPlanType}`);
    }

    return subscriptionPlan;
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

    await this.invalidateSubscriptionPlansCache();
  }

  private async invalidateSubscriptionPlansCache(): Promise<void> {
    await redisClient.del("subscription-plans");
  }
}
