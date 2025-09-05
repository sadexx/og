import { ESubscriptionPlanType } from "../enums";

export interface ISubscriptionPlan {
  isActive: boolean;
  type: ESubscriptionPlanType;
  liveWorkout: boolean;
  workoutLibrary: boolean;
  stretches: boolean;
  intervalLog: boolean;
  tutorialVideos: boolean;
  globalStats: boolean;
  dailyReports: boolean;
  progressGraph: boolean;
  leaderboard: boolean;
  rollingPlan: boolean;
  customWorkouts: boolean;
  customStretches: boolean;
  coins: number;
  fitnessGroupSlots: number;
}
