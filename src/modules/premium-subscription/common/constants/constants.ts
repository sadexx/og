import { EPremiumSubscriptionDuration } from "../enums";

export const premiumSubscriptionDurationMapping: Record<EPremiumSubscriptionDuration, number> = {
  [EPremiumSubscriptionDuration.MONTHLY]: 1,
  [EPremiumSubscriptionDuration.YEARLY]: 12
};
