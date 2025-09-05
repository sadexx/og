import { EPremiumSubscriptionDuration } from "../enums";
import { ICreatePremiumSubscription } from "../interfaces";

export const premiumSubscriptionSeedData: ICreatePremiumSubscription[] = [
  {
    price: 10,
    isActive: true,
    duration: EPremiumSubscriptionDuration.MONTHLY
  },
  {
    price: 80,
    isActive: true,
    duration: EPremiumSubscriptionDuration.YEARLY
  }
];
