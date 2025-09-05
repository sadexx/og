import { CoachSubscriptionStatisticOutput } from "./coach-subscriptions-statistic.output";

export class AllCoachSubscriptionsStatisticsOutput {
  totalActiveSubscriptions: number;
  coaches: CoachSubscriptionStatisticOutput[];
}
