import { CoachSubscription } from "../../../coach/schemas";
import { PremiumSubscription } from "../../../premium-subscription/schemas";
import { User } from "../../../users/schemas";

export interface ICreateUserSubscription {
  endDate: Date;
  lastRenewedAt: Date;
  isAutoRenewable: boolean;
  user: User;
  coachSubscription: CoachSubscription | null;
  premiumSubscription: PremiumSubscription | null;
}
