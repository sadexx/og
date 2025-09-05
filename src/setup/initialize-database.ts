import { AppDataSource } from "../common/configs/db.config";
import { PremiumSubscriptionService } from "../modules/premium-subscription/services";
import { SubscriptionPlanService } from "../modules/subscription-plan/services/subscription-plan.service";
import { logger } from "./logger";

export async function initializeDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    await seedDatabase();

    logger.info("✅ PostgreSQL Connection was successful.");
  } catch (error) {
    logger.error("❌ Unable to connect to the PostgreSQL:", error);
  }
}

async function seedDatabase(): Promise<void> {
  await PremiumSubscriptionService.seedPremiumSubscriptionsToDatabase();
  await SubscriptionPlanService.seedPremiumSubscriptionsToDatabase();
}
