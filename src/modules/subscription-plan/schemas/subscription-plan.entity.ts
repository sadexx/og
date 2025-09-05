import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column } from "typeorm";
import { ESubscriptionPlanType } from "../common/enums";

@Entity({ name: "subscription_plan" })
export class SubscriptionPlan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    name: "type",
    enum: ESubscriptionPlanType
  })
  type: ESubscriptionPlanType;

  @Column({ type: "boolean", name: "is_active", default: false })
  isActive: boolean;

  @Column({ type: "boolean", name: "live_workout", default: false })
  liveWorkout: boolean;

  @Column({ type: "boolean", name: "workout_library", default: false })
  workoutLibrary: boolean;

  @Column({ type: "boolean", name: "stretches", default: false })
  stretches: boolean;

  @Column({ type: "boolean", name: "interval_log", default: false })
  intervalLog: boolean;

  @Column({ type: "boolean", name: "tutorial_videos", default: false })
  tutorialVideos: boolean;

  @Column({ type: "boolean", name: "global_stats", default: false })
  globalStats: boolean;

  @Column({ type: "boolean", name: "daily_reports", default: false })
  dailyReports: boolean;

  @Column({ type: "boolean", name: "progress_graph", default: false })
  progressGraph: boolean;

  @Column({ type: "boolean", name: "leaderboard", default: false })
  leaderboard: boolean;

  @Column({ type: "boolean", name: "rolling_plan", default: false })
  rollingPlan: boolean;

  @Column({ type: "boolean", name: "custom_workouts", default: false })
  customWorkouts: boolean;

  @Column({ type: "boolean", name: "custom_stretches", default: false })
  customStretches: boolean;

  @Column({ type: "integer", name: "coins", default: 0 })
  coins: number;

  @Column({ type: "integer", name: "fitness_group_slots", default: 0 })
  fitnessGroupSlots: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
