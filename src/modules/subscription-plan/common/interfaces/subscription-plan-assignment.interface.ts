import { User } from "../../../users/schemas";
import { SubscriptionPlan } from "../../schemas";

export interface ISubscriptionPlanAssignment {
  endDate: Date;
  subscriptionPlan: SubscriptionPlan;
  user: User;
}
