import { EPremiumSubscriptionDuration } from "../enums";

export interface ICreatePremiumSubscription {
  price: number;
  isActive: boolean;
  duration: EPremiumSubscriptionDuration;
}
