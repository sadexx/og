import { type Application } from "express";
import express from "express";
import cors from "cors";
import { GLOBAL_PREFIX } from "../common/configs/config";
import cookieParser from "cookie-parser";
import {
  errorMiddleware,
  errorRouteMiddleware,
  morganMiddleware,
  requestMetricsMiddleware,
  responseMetricsMiddleware
} from "../common/middleware";
import { ActivityTypeRoutes } from "../modules/activity-type/activity-type.routes";
import { AudioRoutes } from "../modules/audio/audio.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BatchEntityFetcherRoutes } from "../modules/batch-entity-fetcher/batch-entity-fetcher.routes";
import { CoachWorkoutRoutes } from "../modules/coach-workouts/coach-workouts.routes";
import { CoachRoutes } from "../modules/coach/coach.routes";
import { CoinTransactionsRoutes } from "../modules/coin-transactions/coin-transactions.routes";
import { CustomExerciseRoutes } from "../modules/custom-exercise/custom-exercise.routes";
import { CustomStretchingRoutes } from "../modules/custom-stretching/custom-stretching.routes";
import { CustomWorkoutRoutes } from "../modules/custom-workout/custom-workout.routes";
import { DefaultAudioRoutes } from "../modules/default-audio/default-audio.routes";
import { EmailRoutes } from "../modules/email/email.routes";
import { EquipmentsRoutes } from "../modules/equipments/equipments.routes";
import { ExerciseRoutes } from "../modules/exercise/exercise.routes";
import { FavoriteWorkoutRoutes } from "../modules/favorite-workouts/favorite-workout.routes";
import { FileManagementRoutes } from "../modules/file-management/file-management.routes";
import { FocalBodyPartsRoutes } from "../modules/focal-body-parts/focal-body-parts.routes";
import { GripFirmwareRoutes } from "../modules/grip-firmware/grip-firmware.routes";
import { GripTypesRoutes } from "../modules/grip-types/grip-types.routes";
import { GroupRoutes } from "../modules/group/group.routes";
import { HealthCheckRoutes } from "../modules/health-check/health-check.routes";
import { JustMetricsWorkoutExerciseTypesRoutes } from "../modules/just-metrics-workout-exercise-types/just-metrics-workout-exercise-types.routes";
import { LogsRoutes } from "../modules/logs/logs.routes";
import { LowerBodyMovementTypeRoutes } from "../modules/lower-body-movement-type/lower-body-movement-type.routes";
import { MetricsRoutes } from "../modules/metrics/metrics.routes";
import { RollingPlanRoutes } from "../modules/rolling-plan/rolling-plan.routes";
import { SettingsRoutes } from "../modules/settings/settings.routes";
import { StatisticsRoutes } from "../modules/statistics/statistics.routes";
import { StrainClassRoutes } from "../modules/strain-class/strain-class.routes";
import { StretchingExerciseRoutes } from "../modules/stretching-exercise/stretching-exercise.routes";
import { StretchingRoutes } from "../modules/stretching/stretching.routes";
import { UserSubscriptionsRoutes } from "../modules/user-subscriptions/user-subscriptions.routes";
import { UserDailyReportRoutes } from "../modules/users-daily-report/user-daily-report.routes";
import { UserExerciseDailyLogRoutes } from "../modules/users-exercise-daily-log/user-exercise-daily-log.routes";
import { UserGlobalStatsRoutes } from "../modules/users-global-stats/user-global-stats.routes";
import { UserWorkoutDailyLogRoutes } from "../modules/users-workout-daily-log/user-workout-daily-log.routes";
import { UsersRoutes } from "../modules/users/users.routes";
import { VideoRoutes } from "../modules/video/video.routes";
import { WorkoutCategoryRoutes } from "../modules/workout-category/workout-category.routes";
import { WorkoutExerciseRoutes } from "../modules/workout-exercise/workout-exercise.routes";
import { WorkoutsRoutes } from "../modules/workout/workout.routes";
import { GroupStatisticRoutes } from "../modules/group-statistic/group-statistic.routes";
import { join } from "path";
import { AppStoreProductRoutes } from "../modules/app-store-product/app-store-product.routes";
import { PremiumSubscriptionsRoutes } from "../modules/premium-subscription/premium-subscription.routes";
import { SubscriptionPlanRoutes } from "../modules/subscription-plan/subscription-plan.routes";

export class App {
  public express: Application;

  constructor() {
    this.express = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.express.use(cors({ origin: true, credentials: true }));
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
    this.express.use(requestMetricsMiddleware);
    this.express.use(morganMiddleware);
    this.express.use(responseMetricsMiddleware);
    this.express.set("trust proxy", 1);
    this.express.use(cookieParser());
    this.express.use(express.static(join(__dirname, "..", "modules", "deep-link")));
  }

  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
    this.express.use(errorRouteMiddleware);
  }

  private initializeRoutes(): void {
    const routes = [
      new ActivityTypeRoutes(),
      new EquipmentsRoutes(),
      new ExerciseRoutes(),
      new LowerBodyMovementTypeRoutes(),
      new StretchingExerciseRoutes(),
      new StretchingRoutes(),
      new VideoRoutes(),
      new WorkoutsRoutes(),
      new WorkoutCategoryRoutes(),
      new WorkoutExerciseRoutes(),
      new AudioRoutes(),
      new SettingsRoutes(),
      new FileManagementRoutes(),
      new DefaultAudioRoutes(),
      new UsersRoutes(),
      new UserDailyReportRoutes(),
      new UserWorkoutDailyLogRoutes(),
      new UserExerciseDailyLogRoutes(),
      new StatisticsRoutes(),
      new UserGlobalStatsRoutes(),
      new AuthRoutes(),
      new EmailRoutes(),
      new MetricsRoutes(),
      new FocalBodyPartsRoutes(),
      new GripTypesRoutes(),
      new JustMetricsWorkoutExerciseTypesRoutes(),
      new FavoriteWorkoutRoutes(),
      new CustomWorkoutRoutes(),
      new CustomExerciseRoutes(),
      new CustomStretchingRoutes(),
      new RollingPlanRoutes(),
      new StrainClassRoutes(),
      new HealthCheckRoutes(),
      new GripFirmwareRoutes(),
      new BatchEntityFetcherRoutes(),
      new LogsRoutes(),
      new CoachRoutes(),
      new CoachWorkoutRoutes(),
      new CoinTransactionsRoutes(),
      new UserSubscriptionsRoutes(),
      new GroupRoutes(),
      new GroupStatisticRoutes(),
      new AppStoreProductRoutes(),
      new PremiumSubscriptionsRoutes(),
      new SubscriptionPlanRoutes()
    ];

    routes.forEach((route) => {
      this.express.use(GLOBAL_PREFIX, route.router);
    });
  }
}
